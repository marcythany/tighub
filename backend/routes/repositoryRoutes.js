import express from 'express';
import { rateLimitMiddleware } from '../middleware/rateLimitMiddleware.js';
import Repository from '../models/Repository.js';

const router = express.Router();

// Rota para buscar os repositórios do usuário autenticado
router.get('/repositories', rateLimitMiddleware, async (req, res) => {
	try {
		const { sort } = req.query; // 'recent', 'stars', 'forks'

		let sortCriteria = {};
		switch (sort) {
			case 'stars':
				sortCriteria = { stars_count: -1 };
				break;
			case 'forks':
				sortCriteria = { forks_count: -1 };
				break;
			case 'recent':
			default:
				sortCriteria = { createdAt: -1 };
				break;
		}

		const repositories = await Repository.find({ userId: req.user.id })
			.sort(sortCriteria)
			.exec();

		res.json(repositories);
	} catch (error) {
		console.error('Erro ao buscar repositórios:', error.message);
		res.status(500).json({ message: 'Erro ao buscar repositórios' });
	}
});

export default router;
