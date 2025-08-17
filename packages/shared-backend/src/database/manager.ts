import { DataSource } from 'typeorm';
import { createDataSource, CreateDataSourceOptions } from './connection.js';

export class DatabaseManager {
  private dataSource: DataSource | null = null;
  private options: CreateDataSourceOptions;

  constructor(options: CreateDataSourceOptions = {}) {
    this.options = options;
  }

  async initialize(): Promise<DataSource> {
    if (!this.dataSource) {
      this.dataSource = createDataSource(this.options);
      await this.dataSource.initialize();
      console.log('Database connection established');
    }
    return this.dataSource;
  }

  getDataSource(): DataSource {
    if (!this.dataSource) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.dataSource;
  }

  async close(): Promise<void> {
    if (this.dataSource) {
      await this.dataSource.destroy();
      this.dataSource = null;
      console.log('Database connection closed');
    }
  }

  isInitialized(): boolean {
    return this.dataSource !== null && this.dataSource.isInitialized;
  }
}

// Singleton instance for default database connection
let defaultManager: DatabaseManager | null = null;

export function getDefaultDatabaseManager(options?: CreateDataSourceOptions): DatabaseManager {
  if (!defaultManager) {
    defaultManager = new DatabaseManager(options);
  }
  return defaultManager;
}