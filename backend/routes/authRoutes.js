import express from 'express';
import passport from 'passport';

const router = express.Router();

// Rota de login
// Aqui, o usuário será redirecionado para o GitHub para autenticação
router.get(
	'/login',
	passport.authenticate('github', { scope: ['user:email'] })
);

// Rota para autenticação com o GitHub
router.get(
	'/github',
	passport.authenticate('github', { scope: ['user:email'] })
);

// Callback da autenticação com o GitHub
router.get(
	'/github/callback',
	passport.authenticate('github', { failureRedirect: '/login' }),
	async (req, res) => {
		res.json({
			message: 'Autenticação bem-sucedida!',
			user: req.user, // Dados do usuário autenticado
		});
	}
);

// Rota de logout
router.get('/logout', (req, res) => {
	req.logout((err) => {
		if (err) {
			return res.status(500).json({ message: 'Erro ao tentar deslogar.' });
		}
		res.redirect('/'); // Redireciona após o logout
	});
});

export default router;
