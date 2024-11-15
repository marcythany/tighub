import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import { authRoutes } from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import exploreRoutes from './routes/exploreRoutes.js';
import ConnectDB from './db/connectDB.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

// Middleware for sessions
app.use(
	session({ secret: 'keyboard cat', resave: false, saveUninitialized: false })
);

// CORS - allow frontend to access the backend
app.use(
	cors({
		origin: 'https://tighub.onrender.com', // Adjust according to your frontend
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

app.listen(PORT, () => {
	ConnectDB();
	console.log('Server started at http://localhost:' + PORT);
});
