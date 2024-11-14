import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import exploreRoutes from './routes/exploreRoutes.js';
import ConnectDB from './db/connectDB.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());

app.get('', async (req, res) => {
	res.send('Tô de pé');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/explore/', exploreRoutes);

app.listen(PORT, () => {
	console.log(`Server está rodando em http://localhost:${PORT}`);
	ConnectDB();
});
