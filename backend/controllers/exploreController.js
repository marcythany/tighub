import githubAPI from '../services/github.js';

export const explorePopularRepos = async (req, res) => {
	const { language } = req.params;

	try {
		if (!language) {
			return res.status(400).json({ error: 'Linguagem não válida' });
		}

		// Chamando o método getLanguages para buscar os languages
		const data = await githubAPI.getRepositories(language);

		res.status(200).json({ data });
	} catch (error) {
		console.error('Error fetching languages:', error);
		res.status(500).json({
			error: error.message || 'Erro ao buscar linguagens no repositório',
		});
	}
};
