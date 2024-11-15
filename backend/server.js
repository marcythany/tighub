import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import session from 'express-session';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import exploreRoutes from './routes/exploreRoutes.js';
import ConnectDB from './db/connectDB.js';

// Carrega as variáveis de ambiente
dotenv.config();

// Inicializa o Express
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Conecta ao banco de dados
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

// Middleware para análise do corpo da requisição (se necessário)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/explore', exploreRoutes);

// Rota de saúde do servidor
app.get('/', (req, res) => {
	res.send('Servidor está funcionando!');
});

// Configuração para produção (servir o frontend)
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, 'frontend', 'dist')));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
	});
}

// Inicia o servidor
app.listen(PORT, () => {
	console.log(`Servidor iniciado em http://localhost:${PORT}`);
});
