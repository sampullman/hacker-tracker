import { config as dotenvConfig } from "dotenv";
import { DataSource } from "typeorm";
import { UserEntity } from "./entities/User.js";

dotenvConfig();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "127.0.0.1",
  port: parseInt(process.env.DB_PORT || "5440", 10),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "hacker_tracker",
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  entities: [UserEntity],
  migrations: ["src/migrations/*.ts"],
  migrationsTableName: "migrations",
});

export default AppDataSource;
