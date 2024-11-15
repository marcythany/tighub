import { createServer } from '@vercel/node';
import app from '../server'; // Importando o app do backend

export default createServer(app); // Expondo o app como uma função serverless
