import Repository from '../models/Repository.js';
import User from '../models/User.js';
import { getUserRepos } from '../services/githubService.js'; // Para obter os repositórios do GitHub

// Adicionar repositórios ao banco de dados para um usuário
export const addRepositories = async (accessToken, userId) => {
	try {
		// Obter os repositórios do usuário do GitHub
		const repos = await getUserRepos(accessToken);

		// Encontrar o usuário no banco de dados
		const user = await User.findById(userId);
		if (!user) {
			throw new Error('Usuário não encontrado');
		}

		// Adicionar os repositórios ao banco de dados
		const repositories = await Promise.all(
			repos.map(async (repo) => {
				const newRepo = new Repository({
					name: repo.name,
					description: repo.description,
					stars: repo.stargazers_count,
					forks: repo.forks_count,
					language: repo.language,
					githubUrl: repo.html_url,
					userId: user._id,
				});

				// Salvar o repositório no banco de dados
				await newRepo.save();

				return newRepo;
			})
		);

		// Atualizar o usuário com os repositórios
		user.repositories = repositories.map((repo) => repo._id);
		await user.save();

		return repositories;
	} catch (error) {
		console.error('Erro ao adicionar repositórios:', error.message);
		throw new Error('Erro ao adicionar repositórios');
	}
};

// Buscar todos os repositórios de um usuário
export const getUserRepositories = async (userId) => {
	try {
		const user = await User.findById(userId).populate('repositories');
		if (!user) {
			throw new Error('Usuário não encontrado');
		}
		return user.repositories;
	} catch (error) {
		console.error('Erro ao buscar os repositórios:', error.message);
		throw new Error('Erro ao buscar os repositórios');
	}
};

// Ordenar os repositórios por estrelas ou forks
export const sortRepositories = async (userId, sortBy = 'stars') => {
	try {
		const user = await User.findById(userId).populate('repositories');
		if (!user) {
			throw new Error('Usuário não encontrado');
		}

		// Ordenar repositórios conforme o critério
		const sortedRepos = user.repositories.sort((a, b) => {
			if (sortBy === 'stars') {
				return b.stars - a.stars;
			} else if (sortBy === 'forks') {
				return b.forks - a.forks;
			}
			return 0; // Default (não ordenar)
		});

		return sortedRepos;
	} catch (error) {
		console.error('Erro ao ordenar os repositórios:', error.message);
		throw new Error('Erro ao ordenar os repositórios');
	}
};
