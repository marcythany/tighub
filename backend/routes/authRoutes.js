import express from 'express';
import { signin, signout } from '../auth/Auth.js';

const router = express.Router();

// Rotas de autenticação usando Auth.js
// Assegure-se de que signin está retornando uma função de callback
router.get('/auth/github', (req, res, next) => {
	try {
		signin(req, res, next);
	} catch (error) {
		res.status(500).json({ error: 'Erro durante a autenticação.' });
	}
});

// Callback para o GitHub
router.get('/auth/github/callback', (req, res, next) => {
	try {
		signin(req, res, next);
	} catch (error) {
		res.status(500).json({ error: 'Erro durante o callback de autenticação.' });
	}
});

// Verificar se o usuário está autenticado
router.get('/check', (req, res) => {
	if (req.session && req.session.user) {
		res.json({ user: req.session.user });
	} else {
		res.json({ user: null });
	}
});

// Rota de logout
router.get('/logout', async (req, res) => {
	try {
		await signout(req);
		req.session.destroy((err) => {
			if (err) {
				return res.status(500).json({ error: 'Erro ao destruir a sessão.' });
			}
			res.json({ message: 'Desconectado com sucesso.' });
		});
	} catch (error) {
		res.status(500).json({ error: 'Erro ao sair.' });
	}
});

export default router;
