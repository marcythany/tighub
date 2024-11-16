import axios from 'axios';

export const explorePopularRepos = async (req, res) => {
	const { language } = req.params;

	if (!language) {
		return res.status(400).json({ error: 'Language parameter is required' });
	}

	try {
		const url = `https://api.github.com/search/repositories?q=language:${encodeURIComponent(
			language
		)}&sort=stars&order=desc&per_page=10`;

		const headers = {
			Accept: 'application/vnd.github.v3+json',
			Authorization: `token ${process.env.GITHUB_API_KEY}`, // Certifique-se de que o token é lido aqui
		};

		console.log('Headers:', headers); // Log para garantir que o token está presente

		const response = await axios.get(url, { headers });

		if (response.status !== 200) {
			console.error('Erro da API do GitHub:', response.data);
			throw new Error(
				response.data.message || `GitHub API error: ${response.status}`
			);
		}

		const data = response.data;

		// Verificação adicional
		if (!data.items || !Array.isArray(data.items)) {
			console.error('Resposta da API não contém repositórios válidos:', data);
			throw new Error('A resposta da API não contém repositórios válidos');
		}

		res.status(200).json({ repos: data.items });
	} catch (error) {
		console.error('Error fetching repositories:', error);
		res.status(500).json({ error: error.message });
	}
};
