import { ensureAuthenticated } from '@auth/express';

// Protected route
app.get('/protected', ensureAuthenticated, (req, res) => {
	// Access the authenticated user through req.user
	res.send(`Welcome, ${req.user.name}!`);
});
