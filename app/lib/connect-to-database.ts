import { convertStringToNumber } from './utils';
import { Pool } from 'pg';
import dotenv from 'dotenv';


dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: convertStringToNumber(process.env.POSTGRES_PORT),
});

export async function connectToDatabase() {
  try {
    const client = await pool.connect(); // Get a client from the pool
    return client;
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error);
    throw error;
  }
}