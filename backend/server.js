import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';

import './passport/githubAuth.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import exploreRoutes from './routes/exploreRoutes.js';
import ConnectDB from './db/connectDB.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(
	session({ secret: 'keyboard cat', resave: false, saveUninitialized: false })
);
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(
	cors({
		origin: 'http://localhost:3000',
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

app.listen(PORT, () => {
	console.log(`Server está rodando em http://localhost:${PORT}`);
	ConnectDB();
});
