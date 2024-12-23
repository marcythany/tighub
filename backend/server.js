import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import passport from './passport/github.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import repositoryRoutes from './routes/repositoryRoutes.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

// Verify required environment variables
const requiredEnvVars = [
    'MONGO_URI',
    'SESSION_SECRET',
    'GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET',
    'FRONTEND_URL',
    'CORS_ORIGINS'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// CORS configuration
const corsOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [];
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Em desenvolvimento, aceita qualquer origem
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        
        // Em produção, verifica se a origem está na lista permitida
        if (corsOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true, // Necessário para HTTPS behind proxy
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Debug middleware for session
app.use((req, res, next) => {
    console.log('Session:', req.session);
    console.log('User:', req.user);
    next();
});

// Middleware para servir arquivos estáticos do frontend
app.use(express.static(join(__dirname, '../frontend/dist')));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/repositories', repositoryRoutes);

// Rota para todas as outras requisições que não são da API
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../frontend/dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    // Handle authentication errors
    if (err.name === 'AuthenticationError') {
        return res.status(401).json({
            error: 'Authentication Error',
            message: err.message
        });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            message: err.message
        });
    }
    
    // Handle rate limit errors
    if (err.name === 'RateLimitError') {
        return res.status(429).json({
            error: 'Rate Limit Error',
            message: err.message
        });
    }
    
    // Default error
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
    });
});

// Connect to MongoDB and start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
