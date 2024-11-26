import express from 'express';
import { rateLimitMiddleware } from '../middleware/rateLimitMiddleware.js';
import User from '../models/User.js';
import isAuthenticated from '../middleware/authMiddleware.js'; // Importando o middleware de autenticação

const router = express.Router();

// Rota para obter os dados do usuário
router.get(
	'/profile',
	rateLimitMiddleware,
	isAuthenticated,
	async (req, res) => {
		try {
			const user = await User.findOne({ githubId: req.user.id }).populate(
				'repositories'
			);
			if (!user) {
				return res.status(404).json({ message: 'Usuário não encontrado' });
			}
			return res.json(user);
		} catch (error) {
			console.error('Erro ao obter perfil do usuário:', error);
			return res.status(500).json({ message: 'Erro ao obter perfil' });
		}
	}
);

export default router;
