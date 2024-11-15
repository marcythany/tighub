import { ExpressAuth } from '@auth/express';
import express from 'express';

const app = express();

// If your app is served through a proxy, trust the proxy
// to allow us to read the `X-Forwarded-*` headers
app.set('trust proxy', true);

// Mount the Auth.js API on the "/auth/*" routes
app.use(
	'/auth/*',
	ExpressAuth({
		providers: [
			// Add your authentication providers here
			// (e.g., GitHub, Google, Twitter, etc.)
		],
	})
);

// Export the necessary components
export const { signin, signout } = ExpressAuth;
export const authRoutes = app;
