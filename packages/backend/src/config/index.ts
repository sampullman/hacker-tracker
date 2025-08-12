import { config as dotenvConfig } from "dotenv";

dotenvConfig();

export const config = {
  server: {
    port: parseInt(process.env.PORT || "3001", 10),
    nodeEnv: process.env.NODE_ENV || "development",
  },
  database: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: parseInt(process.env.DB_PORT || "5440", 10),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "hacker_tracker",
    ssl: process.env.DB_SSL === "true",
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || "12", 10),
  },
  frontend: {
    url: process.env.FRONTEND_URL || "http://127.0.0.1:5173",
  },
};
