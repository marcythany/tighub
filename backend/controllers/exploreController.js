export const explorePopularRepos = async (req, res) => {
	const { language } = req.params;

	// Log para verificar o parâmetro
	console.log('Linguagem recebida:', language);

	if (!language) {
		return res
			.status(400)
			.json({ error: 'Parâmetro de linguagem não fornecido.' });
	}

	try {
		const url = `https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc&per_page=10`;
		console.log('URL da requisição:', url);

		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.GITHUB_API_KEY}`,
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(`Erro da API do GitHub: ${errorData.message}`);
		}

		const data = await response.json();

		if (!data.items) {
			throw new Error('Nenhum repositório encontrado.');
		}

		res.status(200).json({ repos: data.items });
	} catch (error) {
		console.error('Erro ao buscar repositórios populares:', error.message);
		res
			.status(500)
			.json({ error: error.message || 'Erro ao buscar repositórios.' });
	}
};
