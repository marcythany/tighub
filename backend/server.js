import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport'; // Corrigido para importar o passport principal

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import exploreRoutes from './routes/exploreRoutes.js';
import protectedRouter from './routes/protected-route.js';
import ConnectDB from './db/connectDB.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

ConnectDB();

// Middleware de sessão (ideal para mover o segredo para uma variável de ambiente)
app.use(
	session({
		secret: process.env.SESSION_SECRET || 'keyboard_cat',
		resave: false,
		saveUninitialized: false,
	})
);

// Configurações de CORS para permitir acesso do frontend
app.use(
	cors({
		origin: process.env.CLIENT_BASE_URL || 'http://localhost:3000', // Ajuste conforme necessário
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true,
	})
);

// Middleware para análise do corpo da requisição
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do Passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
	cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
	cb(null, obj);
});

app.use('/protected', protectedRouter);

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/explore', exploreRoutes);

// Rota de saúde do servidor
app.get('/', (req, res) => {
	res.send('Servidor está funcionando!');
});

// Inicia o servidor
app.listen(PORT, () => {
	console.log(`Servidor iniciado em http://localhost:${PORT}`);
});
