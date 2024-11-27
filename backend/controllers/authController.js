import passport from 'passport';
import axios from 'axios';
import User from '../models/User.js';
import { getUserRepos } from '../services/githubService.js';

// Configuração da estratégia do Passport com o GitHub
passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: `${process.env.BASE_URL}/api/auth/github/callback`,
		},
		async function (accessToken, refreshToken, profile, done) {
			try {
				// Verificar o rate limit do GitHub após a autenticação
				const response = await axios.get('https://api.github.com/rate_limit', {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});

				const remainingRequests = response.data.resources.core.remaining;
				const resetTime = response.data.resources.core.reset;

				if (remainingRequests <= 0) {
					const waitTime = resetTime * 1000 - Date.now();
					await new Promise((resolve) => setTimeout(resolve, waitTime));
				}

				// Verifica se o usuário já existe no banco de dados
				let user = await User.findOne({ githubId: profile.id });

				if (!user) {
					// Se o usuário não existir, cria um novo
					user = new User({
						githubId: profile.id,
						username: profile.username || profile.login,
						email: profile.email,
						avatarUrl: profile.photos[0].value,
						accessToken, // Armazenar o accessToken para futuras requisições
					});

					// Salva o usuário no banco de dados
					await user.save();
				} else {
					// Se já existir, apenas atualiza os dados
					user.username = profile.username || profile.login;
					user.email = profile.email;
					user.avatarUrl = profile.photos[0].value;
					user.accessToken = accessToken;

					// Atualiza repositórios do usuário
					const repos = await getUserRepos(accessToken); // Obtém os repositórios do usuário
					user.repositories = repos.map((repo) => repo._id); // Armazena os repositórios no campo `repositories`

					await user.save();
				}

				return done(null, profile); // Retorna o perfil do usuário autenticado
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

// Serializar e desserializar o usuário
passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((obj, done) => {
	done(null, obj);
});
