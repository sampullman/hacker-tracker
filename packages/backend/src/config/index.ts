import { 
  getServerConfig, 
  getDatabaseConfig, 
  getAuthConfig 
} from 'shared-backend/config';

// Re-export configs with backward compatibility
export const config = {
  server: getServerConfig(),
  database: getDatabaseConfig(),
  auth: getAuthConfig(),
  frontend: {
    url: process.env.FRONTEND_URL || 'http://127.0.0.1:3050',
  },
};