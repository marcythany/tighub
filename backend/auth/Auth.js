import { ExpressAuth } from '@auth/express';
import GitHub from '@auth/express/providers/github';
import express from 'express';

const app = express();

app.set('trust proxy', true);

app.use(
	'/auth/*',
	ExpressAuth({
		providers: [GitHub],
	})
);

export const { signin, signout } = ExpressAuth;
export const authRoutes = app;
