import './env.js'; // Ensure environment is initialized

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl: boolean | { rejectUnauthorized: boolean };
}

export function getDatabaseConfig(): DatabaseConfig {
  const ssl = process.env.DB_SSL === 'true';
  
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5440', 10),
    username: process.env.DB_USERNAME || process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'hacker_tracker',
    ssl: ssl ? { rejectUnauthorized: false } : false,
  };
}

export function getDatabaseUrl(): string {
  const config = getDatabaseConfig();
  const { host, port, username, password, database } = config;
  return `postgres://${username}:${password}@${host}:${port}/${database}`;
}