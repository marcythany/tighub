import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';

import './passport/githubAuth.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import exploreRoutes from './routes/exploreRoutes.js';
import ConnectDB from './db/connectDB.js';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Conecta ao banco de dados
ConnectDB();

// Configurações de CORS para permitir acesso do frontend
const corsOptions = {
	credentials: true,
	origin: 'http://localhost:3000',
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));

// Configuração do middleware de CORS
app.use(cors());

// Middleware de sessão (ideal para mover o segredo para uma variável de ambiente)
app.use(
	session({
		secret: process.env.SESSION_SECRET || 'keyboard_cat',
		resave: false,
		saveUninitialized: false,
	})
);

// Middleware para análise do corpo da requisição
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do Passport
app.use(passport.initialize());
app.use(passport.session());

// Serialização e desserialização do Passport
passport.serializeUser((user, cb) => {
	cb(null, user);
});

passport.deserializeUser((obj, cb) => {
	cb(null, obj);
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/explore', exploreRoutes);

// Rota de saúde do servidor
app.get('/', (req, res) => {
	res.send('Servidor está funcionando!');
});

app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
	console.log(`Servidor iniciado em http://localhost:${PORT}`);
});
