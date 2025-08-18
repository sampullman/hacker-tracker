import { DataSource } from 'typeorm';
import { DatabaseManager } from 'shared-backend/database';
import { UserEntity } from 'migrations/src/entities/User';

// Create test database manager
const testDbManager = new DatabaseManager({
  entities: [UserEntity],
  synchronize: true, // OK for tests, drops and recreates schema
  logging: false,
  dropSchema: true,
});

// Legacy compatibility exports
export const createTestDataSource = () => {
  return testDbManager.getDataSource();
};

export const setupTestDatabase = async (): Promise<DataSource> => {
  return testDbManager.initialize();
};

export const cleanupTestDatabase = async (): Promise<void> => {
  return testDbManager.close();
};

export const getTestDataSource = (): DataSource => {
  return testDbManager.getDataSource();
};