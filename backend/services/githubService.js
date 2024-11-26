import axios from 'axios';
import Repository from '../models/Repository.js'; // Modelo para salvar os repositórios no MongoDB

// Função para obter o perfil do usuário logado
export const getUserProfile = async (accessToken) => {
	try {
		const response = await axios.get('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		// Verificar os cabeçalhos de rate limit
		const remainingRequests = response.headers['x-ratelimit-remaining'];
		const resetTime = response.headers['x-ratelimit-reset'];

		console.log(`Requests restantes: ${remainingRequests}`);
		console.log(`Limite será resetado às: ${new Date(resetTime * 1000)}`);

		if (remainingRequests <= 0) {
			// Se o limite de requisições foi atingido, espera até o reset
			const waitTime = resetTime * 1000 - Date.now();
			console.log(`Aguardando ${waitTime / 1000} segundos até o reset...`);
			await new Promise((resolve) => setTimeout(resolve, waitTime));
		}

		return response.data; // Retorna as informações do perfil
	} catch (error) {
		console.error('Erro ao obter o perfil do usuário:', error.message);
		throw new Error('Erro ao conectar com a API do GitHub');
	}
};

// Função para obter os repositórios do usuário logado
export const getUserRepos = async (accessToken, userId) => {
	try {
		const response = await axios.get('https://api.github.com/user/repos', {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		// Verificar os cabeçalhos de rate limit
		const remainingRequests = response.headers['x-ratelimit-remaining'];
		const resetTime = response.headers['x-ratelimit-reset'];

		console.log(`Requests restantes: ${remainingRequests}`);
		console.log(`Limite será resetado às: ${new Date(resetTime * 1000)}`);

		if (remainingRequests <= 0) {
			// Se o limite de requisições foi atingido, espera até o reset
			const waitTime = resetTime * 1000 - Date.now();
			console.log(`Aguardando ${waitTime / 1000} segundos até o reset...`);
			await new Promise((resolve) => setTimeout(resolve, waitTime));
		}

		// Iterar sobre os repositórios e salvar/atualizar no banco de dados
		for (const repo of response.data) {
			const {
				id,
				name,
				description,
				language,
				forks_count,
				stargazers_count,
				created_at,
				updated_at,
			} = repo;

			// Verificar se o repositório já existe no banco
			let repository = await Repository.findOne({ githubId: id });

			// Se não existir, criar um novo repositório
			if (!repository) {
				repository = new Repository({
					userId, // ID do usuário autenticado
					githubId: id,
					name,
					description,
					language,
					forks_count,
					stars_count: stargazers_count,
					created_at,
					updated_at,
				});
				await repository.save();
			} else {
				// Se já existir, apenas atualiza os dados do repositório
				repository.name = name;
				repository.description = description;
				repository.language = language;
				repository.forks_count = forks_count;
				repository.stars_count = stargazers_count;
				repository.updated_at = updated_at;
				await repository.save();
			}
		}

		return response.data; // Retorna os repositórios do usuário
	} catch (error) {
		console.error('Erro ao obter os repositórios:', error.message);
		throw new Error('Erro ao conectar com a API do GitHub');
	}
};
