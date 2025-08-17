import './env.js'; // Ensure environment is initialized

export interface ServerConfig {
  port: number;
  nodeEnv: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

export function getServerConfig(): ServerConfig {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  return {
    port: parseInt(process.env.PORT || '3051', 10),
    nodeEnv,
    isDevelopment: nodeEnv === 'development',
    isProduction: nodeEnv === 'production',
    isTest: nodeEnv === 'test',
  };
}