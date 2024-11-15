import githubAPI from '../services/github.js';
import User from '../models/userModels.js';
import connectionMongoDB from '../db/connectDB.js';

const handleError = (res, message, error) => {
	console.error(message, error);
	return res.status(500).json({ error: message });
};

// Função para criar ou buscar um usuário pelo username
const getOrCreateUserByUsername = async (username) => {
	let userToLike = await User.findOne({ username });

	if (!userToLike) {
		const userProfileFromAPI = await githubAPI.getUser(username);

		if (!userProfileFromAPI || !userProfileFromAPI.login) {
			throw new Error('Usuário não encontrado na API ou sem username.');
		}

		userToLike = new User({
			username: userProfileFromAPI.login,
			name: userProfileFromAPI.name,
			profileUrl: userProfileFromAPI.html_url,
			avatarUrl: userProfileFromAPI.avatar_url,
			likedProfiles: [],
			likedBy: [],
		});

		await userToLike.save();
	}

	return userToLike;
};

// Função para curtir ou remover like de um perfil
export const likeProfile = async (req, res) => {
	const { username } = req.params;

	try {
		await connectionMongoDB();

		const user = await User.findById(req.user._id.toString());
		let userToLike = await getOrCreateUserByUsername(username);

		const isLiked = user.likedProfiles.includes(userToLike.username);

		// Operação de curtir ou remover like
		if (isLiked) {
			user.likedProfiles = user.likedProfiles.filter(
				(likedUsername) => likedUsername !== userToLike.username
			);
			userToLike.likedBy = userToLike.likedBy.filter(
				(liker) => liker.username !== user.username
			);
		} else {
			userToLike.likedBy.push({
				username: user.username,
				avatarUrl: user.avatarUrl,
				likedDate: Date.now(),
			});
			user.likedProfiles.push(userToLike.username);
		}

		// Salvando as alterações
		await userToLike.save();
		await user.save();

		res.status(200).json({
			message: isLiked ? 'Like removido!' : 'Usuário curtido!',
		});
	} catch (error) {
		handleError(res, 'Erro ao processar o like:', error);
	}
};

// Função para pegar os perfis curtidos
export const getLikes = async (req, res) => {
	try {
		const user = await User.findById(req.user._id.toString());

		const { page = 1, limit = 10 } = req.query;

		const likedProfiles = await Promise.all(
			user.likedProfiles.map(async (username) => {
				const likedUser = await User.findOne({ username });
				if (likedUser) {
					likedUser.likedDate = likedUser.likedBy.find(
						(liker) => liker.username === user.username
					)?.likedDate;
					return likedUser;
				}
				return null;
			})
		);

		const filteredLikedProfiles = likedProfiles.filter(Boolean);

		res
			.status(200)
			.json({ likedProfiles: filteredLikedProfiles, likedBy: user.likedBy });
	} catch (error) {
		handleError(res, 'Erro ao buscar likes:', error);
	}
};

// Função para pegar o perfil e repositórios de um usuário
export const getUserProfileAndRepos = async (req, res) => {
	const { username } = req.params;

	try {
		await connectionMongoDB();

		const userProfile = await githubAPI.getUser(username);
		if (!userProfile) {
			return res.status(404).json({ error: 'Usuário não encontrado na API.' });
		}

		const repos = await githubAPI.getUserRepositories(username);

		res.status(200).json({ userProfile, repos });
	} catch (error) {
		handleError(res, 'Erro ao buscar dados do GitHub:', error);
	}
};

// Função para pegar o perfil do usuário autenticado
export const getUserProfile = async (req, res) => {
	try {
		await connectionMongoDB();

		const user = await User.findById(req.user._id.toString());

		if (!user) {
			return res.status(404).json({ error: 'Usuário não encontrado' });
		}

		// Remove dados sensíveis
		const { password, ...userData } = user.toObject();

		res.status(200).json(userData);
	} catch (error) {
		handleError(res, 'Erro ao buscar o perfil do usuário', error);
	}
};
