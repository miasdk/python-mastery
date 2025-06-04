import pkg from "pg";
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Smart connection handling for both local development and cloud deployment
const connectionString = process.env.DATABASE_URL || 'postgresql://miaelena@localhost:5432/pythonmastery';

if (!connectionString) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Log connection info in development
if (process.env.NODE_ENV === 'development') {
  const isLocal = connectionString.includes('localhost');
  console.log(`🗄️  Database: ${isLocal ? 'Local PostgreSQL' : 'Cloud Database'}`);
  console.log(`🔗 Connection: ${connectionString.replace(/\/\/.*@/, '//***@')}`); // Hide credentials
}

// Configure connection pool for both local and cloud
const poolConfig = {
  connectionString,
  // Cloud-optimized settings (safe for local too)
  max: 20,                    // Maximum connections
  idleTimeoutMillis: 30000,   // Close idle connections after 30s
  connectionTimeoutMillis: 2000, // Timeout after 2s
};

export const pool = new Pool(poolConfig);
export const db = drizzle(pool, { schema });

// Graceful shutdown handler
process.on('SIGINT', async () => {
  console.log('🔌 Closing database connections...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🔌 Closing database connections...');
  await pool.end();
  process.exit(0);
});