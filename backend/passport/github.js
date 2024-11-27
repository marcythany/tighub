import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';
import { checkGithubRateLimit } from '../middleware/rateLimitMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../', '.env') });

// Debug environment variables
console.log('Passport Environment Check:', {
    BASE_URL: process.env.BASE_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ? 'Set' : 'Not Set',
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ? 'Set' : 'Not Set'
});

// Verify required environment variables
const requiredEnvVars = ['GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET', 'BASE_URL'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Serialização do usuário para a sessão
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialização do usuário da sessão
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Configuração da estratégia do GitHub
const githubConfig = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/auth/github/callback`,
};

passport.use('github', new GitHubStrategy(githubConfig,
    async function (accessToken, refreshToken, profile, done) {
        try {
            // Check GitHub rate limit
            try {
                await checkGithubRateLimit(accessToken);
            } catch (error) {
                // Continue with authentication even if rate limit check fails
            }

            // Usar o novo método do modelo para criar ou atualizar usuário
            const user = await User.findOrCreateFromGitHub(profile, accessToken);
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }
));

export default passport;
