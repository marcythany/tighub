import githubAPI from '../services/github.js';

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
