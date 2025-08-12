import { config as dotenvConfig } from "dotenv";
import { DataSource } from "typeorm";
import { UserEntity } from "migrations/src/entities/User.js";

dotenvConfig();

export const createTestDataSource = () => {
  return new DataSource({
    type: "postgres",
    host: process.env.TEST_DB_HOST || process.env.DB_HOST || "localhost",
    port: parseInt(
      process.env.TEST_DB_PORT || process.env.DB_PORT || "5440",
      10
    ),
    username:
      process.env.TEST_DB_USERNAME || process.env.DB_USERNAME || "postgres",
    password:
      process.env.TEST_DB_PASSWORD || process.env.DB_PASSWORD || "postgres",
    database: process.env.TEST_DB_NAME || "hacker_tracker",
    ssl:
      (process.env.TEST_DB_SSL || process.env.DB_SSL) === "true"
        ? { rejectUnauthorized: false }
        : false,
    synchronize: true, // OK for tests, drops and recreates schema
    logging: false,
    entities: [UserEntity],
    dropSchema: true,
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
    throw new Error("Test database not initialized");
  }
  return testDataSource;
};
