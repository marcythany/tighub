import User from '../models/User.js';
import { getUserProfile } from '../services/githubService.js'; // Para obter informações do GitHub

// Criar ou encontrar um usuário no banco de dados com base no perfil do GitHub
export const createOrFindUser = async (accessToken) => {
	try {
		// Buscar o perfil do usuário do GitHub
		const profile = await getUserProfile(accessToken);

		// Verificar se o usuário já existe no banco de dados
		let user = await User.findOne({ githubId: profile.id });

		if (!user) {
			// Se o usuário não existir, cria um novo
			user = new User({
				githubId: profile.id,
				username: profile.login,
				email: profile.email,
				avatarUrl: profile.avatar_url,
				accessToken: accessToken,
			});
			await user.save();
		}

		return user;
	} catch (error) {
		console.error('Erro ao criar ou buscar o usuário:', error.message);
		throw new Error('Erro ao criar ou buscar o usuário');
	}
};

// Buscar o perfil do usuário logado
export const getUserProfileById = async (userId) => {
	try {
		const user = await User.findById(userId).populate('repositories');
		if (!user) {
			throw new Error('Usuário não encontrado');
		}
		return user;
	} catch (error) {
		console.error('Erro ao buscar o perfil do usuário:', error.message);
		throw new Error('Erro ao buscar o perfil do usuário');
	}
};

// Atualizar as informações do usuário
export const updateUserProfile = async (userId, updateData) => {
	try {
		const user = await User.findByIdAndUpdate(userId, updateData, {
			new: true,
		});
		if (!user) {
			throw new Error('Usuário não encontrado');
		}
		return user;
	} catch (error) {
		console.error('Erro ao atualizar o perfil do usuário:', error.message);
		throw new Error('Erro ao atualizar o perfil do usuário');
	}
};
