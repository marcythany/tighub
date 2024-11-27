import rateLimit from 'express-rate-limit';
import axios from 'axios';

// Função para verificar o rate limit da API do GitHub
export const checkGithubRateLimit = async (accessToken) => {
    try {
        const response = await axios.get('https://api.github.com/rate_limit', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const remainingRequests = response.data.resources.core.remaining;
        const resetTime = response.data.resources.core.reset;
        
        if (remainingRequests <= 0) {
            const resetDate = new Date(resetTime * 1000);
            throw new Error(`Limite de requisições da API do GitHub atingido. Tente novamente após ${resetDate.toLocaleString()}`);
        }
        
        return { remainingRequests, resetTime };
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error('Token de acesso inválido ou expirado');
        }
        throw error;
    }
};

// Middleware de rate limiting para Express
export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limita a 100 requisições por IP
    message: 'Muitas requisições feitas. Tente novamente mais tarde.',
});

// Middleware para verificar o rate limit da API do GitHub
export const githubRateLimitMiddleware = async (req, res, next) => {
    try {
        if (req.user?.accessToken) {
            await checkGithubRateLimit(req.user.accessToken);
        }
        next();
    } catch (error) {
        res.status(429).json({ message: error.message });
    }
};

export { githubRateLimitMiddleware as rateLimitMiddleware };
