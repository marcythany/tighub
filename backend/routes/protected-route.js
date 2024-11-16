import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
	if (req.session && req.session.passport) {
		res.send({
			message: 'Não pode acessar esta rota sem estar autenticado.',

			'display Name': req.session.passport.user.displayName,
		});
	} else {
		res.json({
			message: 'Você não pode acessar esta rota de API sem estar autenticado.',

			error: 'Você não está autenticado.',
		});
	}
});

export default router;
