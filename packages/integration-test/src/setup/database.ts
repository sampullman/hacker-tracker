import { config as dotenvConfig } from 'dotenv';
import { DataSource } from 'typeorm';
import { UserEntity } from 'migrations/src/entities/User.js';

dotenvConfig();

export const createTestDataSource = () => {
  return new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'hacker_tracker_test',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    synchronize: true, // OK for tests, drops and recreates schema
    logging: false,
    entities: [UserEntity],
    dropSchema: true, // Drop schema on each test run
  });
};

let testDataSource: DataSource | null = null;

export const setupTestDatabase = async (): Promise<DataSource> => {
  testDataSource = createTestDataSource();
  await testDataSource.initialize();
  return testDataSource;
};

export const cleanupTestDatabase = async (): Promise<void> => {
  if (testDataSource) {
    await testDataSource.destroy();
    testDataSource = null;
  }
};

export const getTestDataSource = (): DataSource => {
  if (!testDataSource) {
    throw new Error('Test database not initialized');
  }
  return testDataSource;
};