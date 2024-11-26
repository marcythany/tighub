const isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next(); // Se o usuário estiver autenticado, continua para a rota
	}
	return res.status(401).json({ message: 'Usuário não autenticado' });
};

export default isAuthenticated;
