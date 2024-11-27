import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import '../passport/github.js'; // Import the passport configuration

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../', '.env') });
const router = express.Router();

// Status da autenticação
router.get('/status', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.json({
            authenticated: false,
            user: null
        });
    }

    res.json({
        authenticated: true,
        user: {
            id: req.user.id,
            username: req.user.username,
            avatarUrl: req.user.avatarUrl
        }
    });
});

// Rota de autenticação com o GitHub
router.get('/github',
    (req, res, next) => {
        // Store the return URL in the session
        req.session.returnTo = req.query.returnTo || '/profile';
        next();
    },
    passport.authenticate('github', { 
        scope: ['user:email', 'read:user']
    })
);

// Callback da autenticação com o GitHub
router.get('/github/callback',
    passport.authenticate('github', { 
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
        session: true
    }),
    (req, res) => {
        try {
            // Get the stored return URL from session
            const returnTo = req.session.returnTo || '/profile';
            delete req.session.returnTo;
            
            // Ensure the session is saved before redirecting
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    return res.redirect(`${process.env.FRONTEND_URL}/login?error=session_error`);
                }
                res.redirect(`${process.env.FRONTEND_URL}${returnTo}`);
            });
        } catch (error) {
            console.error('Callback error:', error);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=callback_error`);
        }
    }
);

// Rota de logout
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao tentar deslogar.' });
        }
        res.json({ message: 'Logout realizado com sucesso.' });
    });
});

export default router;
