import { signin, signout } from '../auth/Auth.js';

const router = express.Router();

router.get('/auth/github', signin('github'));

router.get('/auth/github/callback', signin('github'));

router.get('/check', (req, res) => {
	if (req.session.user) {
		res.send({ user: req.session.user });
	} else {
		res.send({ user: null });
	}
});

router.get(
	'/logout',
	signout((req) => {
		req.session.destroy((err) => {
			res.json({ message: 'Logged out' });
		});
	})
);

export default router;
