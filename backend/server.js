import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import path from 'path';

import './passport/githubAuth.js'; // Importe a configuração do Passport

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import exploreRoutes from './routes/exploreRoutes.js';
import ConnectDB from './db/connectDB.js'; // Conectar ao banco de dados

dotenv.config();

const app = express();

const __dirname = path.resolve();

// Middleware para sessões
app.use(
	session({ secret: 'keyboard cat', resave: false, saveUninitialized: false })
);

// Inicialização do Passport
app.use(passport.initialize());
app.use(passport.session());

// CORS - permitir que o frontend acesse o backend
app.use(
	cors({
		origin: 'https://tighub.vercel.app', // Ajuste conforme seu frontend
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true,
	})
);

app.get('', async (req, res) => {
	res.send('Tô de pé');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/explore/', exploreRoutes);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '/frontend/dist')));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
	});
}

// Conectar ao banco de dados na inicialização
ConnectDB();

// Em vez de app.listen(), exporte o app para ser usado como uma função serverless
export default app;
