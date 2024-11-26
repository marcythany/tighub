import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import session from 'express-session';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import repositoryRoutes from './routes/repositoryRoutes.js';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// Conexão ao MongoDB
connectDB();

// Middleware de session e Passport
app.use(
	session({
		secret: 'secreta',
		resave: false,
		saveUninitialized: true,
	})
);
app.use(passport.initialize());
app.use(passport.session());

// Middleware para tratar JSON
app.use(express.json());

// Usar as rotas de autenticação
app.use('/auth', authRoutes);

// Usar as rotas de usuários
app.use('/users', userRoutes);

// Usar as rotas de repositórios
app.use('/repositories', repositoryRoutes);

// Rota de teste
app.get('/', (req, res) => {
	res.send('Bem-vindo ao Backend do Tighub!');
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});
