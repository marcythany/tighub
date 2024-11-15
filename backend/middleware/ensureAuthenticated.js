import { getSession } from '@auth/express';

export async function ensureAuthenticated(req, res, next) {
	const session = res.locals.session ?? (await getSession(req));

	if (!session?.user) {
		return res.status(401).json({ error: 'Não autorizado. Faça login.' });
	}

	// Armazene o usuário autenticado no `req.user`
	req.user = session.user;
	next();
}
