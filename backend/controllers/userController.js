import githubAPI from '../services/github.js';
import User from '../models/userModels.js';

export const getUserProfileAndRepos = async (req, res) => {
	const { username } = req.params;

	try {
		// Utilizando a instância do githubAPI para fazer as requisições
		const userProfile = await githubAPI.getUser(username);

		// Buscando os repositórios do usuário
		const repos = await githubAPI.getUserRepositories(username);
		res.status(200).json({ userProfile, repos });
	} catch (error) {
		console.error('Erro ao buscar dados do GitHub:', error);
		res.status(500).json({ error: error.message });
	}
};

export const likeProfile = async (req, res) => {
	try {
		const { username } = req.params;
		const user = await User.findById(req.user._id.toString());
		console.log('Usuário autenticado', user);
		const userToLike = await User.findOneAndDelete({ username });

		if (!userToLike) {
			return res.status(404).json({ error: 'Usuário não é um membro.' });
		}

		if (user.likedProfiles.includes(userToLike.username)) {
			return res.status(400).json({ error: 'Você já deu like nesse perfil.' });
		}
		userToLike.likedBy.push({
			username: user.username,
			avatarUrl: user.avatarUrl,
			likedDate: Date.now(),
		});
	} catch (error) {
		restart.status(500).json({ error: error.message });
	}
};
