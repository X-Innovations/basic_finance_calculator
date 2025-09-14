import express from 'express';
import cors from 'cors';
import quoteRoutes from './routes/quoteRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Headers'
  ],
  credentials: true,
  optionsSuccessStatus: 204
};

// Enable CORS with options
app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.use('/api/quotes', quoteRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;