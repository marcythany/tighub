import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import User from '../models/User.js';
import { rateLimitMiddleware } from '../middleware/rateLimitMiddleware.js'; // Importando o middleware

// Configuração da estratégia do Passport com o GitHub
passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: `${process.env.BASE_URL}/auth/github/callback`,
		},
		async function (accessToken, refreshToken, profile, done) {
			try {
				// Usando o rateLimitMiddleware para verificar o rate limit antes de continuar
				await rateLimitMiddleware({
					headers: { Authorization: `Bearer ${accessToken}` },
				});

				// Agora que o rate limit foi verificado, podemos continuar com a autenticação

				// Verificar ou criar o usuário no banco de dados
				let user = await User.findOne({ githubId: profile.id });

				if (!user) {
					user = new User({
						githubId: profile.id,
						username: profile.username || profile.login,
						email: profile.email,
						avatarUrl: profile.photos[0].value,
						accessToken,
					});
					await user.save();
				}

				// Se o usuário for encontrado ou criado com sucesso, retornamos o perfil
				return done(null, user);
			} catch (error) {
				console.error(
					'Erro ao verificar o rate limit ou salvar o usuário:',
					error.message
				);
				return done(error, null);
			}
		}
	)
);
