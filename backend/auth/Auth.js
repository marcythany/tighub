import { ExpressAuth } from '@auth/express';
import express from 'express';

const app = express();

app.set('trust proxy', true);

app.use(
	'/auth/*',
	ExpressAuth({
		providers: ['github'],
	})
);

export const { signin, signout } = ExpressAuth;
export const authRoutes = app;
