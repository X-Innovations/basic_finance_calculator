import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  allowedOrigins: string;
  dbPath: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 8081,
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigins: process.env.ALLOWED_ORIGINS || 'http://localhost:5173',
    dbPath: process.env.DB_PATH || 'db.json',
};

export default config;