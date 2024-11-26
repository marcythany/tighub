import rateLimit from 'express-rate-limit';
import axios from 'axios';

// Função para verificar o rate limit da API do GitHub
const checkGithubRateLimit = async (accessToken) => {
	try {
		// Fazendo uma requisição à API do GitHub para obter o rate limit atual
		const response = await axios.get('https://api.github.com/rate_limit', {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		// Retorna o número de requisições restantes e o tempo de reset
		const remainingRequests = response.data.resources.core.remaining;
		const resetTime = response.data.resources.core.reset;
		return { remainingRequests, resetTime };
	} catch (error) {
		console.error('Erro ao verificar o rate limit do GitHub:', error.message);
		return { remainingRequests: 0, resetTime: 0 }; // Retorna valores padrão em caso de erro
	}
};

// Middleware de rate limiting
const rateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	max: 100, // Limita a 100 requisições por IP
	message: 'Muitas requisições feitas. Tente novamente mais tarde.',
});

// Middleware para verificar o rate limit da API do GitHub
const githubRateLimitMiddleware = async (req, res, next) => {
	if (req.user && req.user.accessToken) {
		// Verifica o rate limit da API do GitHub
		const { remainingRequests, resetTime } = await checkGithubRateLimit(
			req.user.accessToken
		);

		// Se o limite de requisições for 0, impede o acesso e envia uma resposta informando
		if (remainingRequests <= 0) {
			const resetDate = new Date(resetTime * 1000);
			return res.status(429).json({
				message: `Limite de requisições da API do GitHub atingido. Tente novamente após ${resetDate.toLocaleString()}`,
			});
		}
	}

	// Se o rate limit do GitHub estiver ok, passa para o próximo middleware
	next();
};

export { rateLimiter, githubRateLimitMiddleware as rateLimitMiddleware };
