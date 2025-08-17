import { DataSource } from 'typeorm';
import { DatabaseManager, createDataSource as createSharedDataSource } from 'shared-backend/database';
import { UserEntity } from './entities/User.js';

// Create a singleton database manager for the backend
const dbManager = new DatabaseManager({
  entities: [UserEntity],
  migrations: [],
  synchronize: false, // Always use migrations in production
});

// Legacy compatibility functions
export const createDataSource = () => {
  return createSharedDataSource({
    entities: [UserEntity],
    migrations: [],
    synchronize: false,
  });
};

export const initializeDatabase = async (): Promise<DataSource> => {
  return dbManager.initialize();
};

export const getDataSource = (): DataSource => {
  return dbManager.getDataSource();
};

export const closeDatabase = async (): Promise<void> => {
  return dbManager.close();
};