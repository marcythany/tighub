import express from 'express';

const router = express.Router();

router.get('/login', (req, res) => {
	res.send('Estás logade');
});

export default router;
