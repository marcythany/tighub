import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';

import './passport/githubAuth.js'; // Importe a configuração do Passport

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import exploreRoutes from './routes/exploreRoutes.js';
import ConnectDB from './db/connectDB.js'; // Conectar ao banco de dados

dotenv.config();

const app = express();

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

// Conectar ao banco de dados na inicialização
ConnectDB();

// Em vez de app.listen(), exporte o app para ser usado como uma função serverless
export default app;
