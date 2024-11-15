import express from 'express';
import passport from 'passport';

const router = express.Router();

// Envio do Formulário
router.get(
	'/auth/github',
	passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
	'/auth/github/callback',
	passport.authenticate('github', {
		failureRedirect: `${process.env.CLIENT_BASE_URL}/login`,
	}),
	function (req, res) {
		// Successful authentication, redirect home.
		res.redirect(`${process.env.CLIENT_BASE_URL}/`);
	}
);

router.get('/check', (req, res) => {
	if (req.isAuthenticated()) {
		res.send({ user: req.user });
	} else {
		res.send({ user: null });
	}
});

router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		res.json({ message: 'Logged out' });
	});
});

export default router;
