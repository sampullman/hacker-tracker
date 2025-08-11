import { DataSource } from 'typeorm';
import { config } from '../config/index.js';
import { UserEntity } from './entities/User.js';

let dataSource: DataSource | null = null;

export const createDataSource = () => {
  return new DataSource({
    type: 'postgres',
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
    synchronize: false, // Always use migrations in production
    logging: config.server.nodeEnv === 'development',
    entities: [UserEntity],
    migrations: [],
  });
};

export const initializeDatabase = async (): Promise<DataSource> => {
  if (!dataSource) {
    dataSource = createDataSource();
    await dataSource.initialize();
    console.log('Database connection established');
  }
  return dataSource;
};

export const getDataSource = (): DataSource => {
  if (!dataSource) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return dataSource;
};

export const closeDatabase = async (): Promise<void> => {
  if (dataSource) {
    await dataSource.destroy();
    dataSource = null;
    console.log('Database connection closed');
  }
};