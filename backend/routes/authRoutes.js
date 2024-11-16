import express from 'express';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2'; // A estratégia do GitHub aqui
import User from '../models/userModels.js'; // Modelo de usuário
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Configuração da estratégia do Passport para autenticação com GitHub
passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_SECRET_KEY,
			callbackURL: process.env.GITHUB_CALLBACK_URL,
		},
		async (accessToken, refreshToken, profile, cb) => {
			try {
				const user = await User.findOne({
					accountId: profile.id,
					provider: 'github',
				});

				if (!user) {
					console.log('Adicionando usuário GitHub ao DB...');
					const newUser = new User({
						accountId: profile.id,
						name: profile.username,
						provider: profile.provider,
					});
					await newUser.save();
					return cb(null, newUser);
				} else {
					console.log('Usuário GitHub já existe no DB...');
					return cb(null, user);
				}
			} catch (error) {
				console.error('Erro ao verificar usuário GitHub:', error);
				return cb(error, null);
			}
		}
	)
);

// Rota de login
router.get(
	'/login',
	passport.authenticate('github', { scope: ['user:email'] })
);

// Rota de callback do GitHub
router.get(
	'/callback',
	passport.authenticate('github', { failureRedirect: '/github/error' }),
	(req, res) => {
		res.redirect('/github/success');
	}
);

// Rota de sucesso
router.get('/success', async (req, res) => {
	const userInfo = {
		id: req.user.id,
		displayName: req.user.username,
		provider: req.user.provider,
	};
	res.json({ message: 'Autenticação bem-sucedida!', user: userInfo });
});

// Rota de erro
router.get('/error', (req, res) => {
	res.send('Erro ao fazer login via GitHub. Tente novamente.');
});

// Rota de logout
router.get('/signout', (req, res) => {
	req.logout((err) => {
		if (err) {
			return res.status(400).send({ message: 'Erro ao fazer logout.' });
		}
		res.redirect('/'); // Redireciona após o logout
	});
});

export default router;
