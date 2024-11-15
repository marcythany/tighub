import express from 'express';
import { signin, signout } from '../auth/Auth.js';

const router = express.Router();

// Rotas de autenticação usando Auth.js
router.get('/auth/github', signin);
router.get('/auth/github/callback', signin); // Callback para o GitHub

// Verificar se o usuário está autenticado
router.get('/check', (req, res) => {
	if (req.session && req.session.user) {
		res.send({ user: req.session.user });
	} else {
		res.send({ user: null });
	}
});

// Rota de logout
router.get('/logout', (req, res) => {
	signout(req)
		.then(() => {
			req.session.destroy((err) => {
				if (err) {
					return res.status(500).json({ error: 'Erro ao fazer logout.' });
				}
				res.json({ message: 'Logged out' });
			});
		})
		.catch((error) => res.status(500).json({ error: 'Erro ao sair.' }));
});

export default router;
