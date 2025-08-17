import { DataSource, DataSourceOptions } from 'typeorm';
import { getDatabaseConfig, getServerConfig } from '../config/index.js';

export interface CreateDataSourceOptions {
  entities?: any[];
  migrations?: any[];
  migrationsTableName?: string;
  synchronize?: boolean;
  logging?: boolean;
  dropSchema?: boolean;
}

export function createDataSourceConfig(options: CreateDataSourceOptions = {}): DataSourceOptions {
  const dbConfig = getDatabaseConfig();
  const serverConfig = getServerConfig();
  
  return {
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    ssl: dbConfig.ssl,
    synchronize: options.synchronize ?? false,
    logging: options.logging ?? serverConfig.isDevelopment,
    entities: options.entities || [],
    migrations: options.migrations || [],
    migrationsTableName: options.migrationsTableName || 'migrations',
    dropSchema: options.dropSchema ?? false,
  };
}

export function createDataSource(options: CreateDataSourceOptions = {}): DataSource {
  const config = createDataSourceConfig(options);
  return new DataSource(config);
}