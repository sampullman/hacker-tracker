import { createDataSource } from 'shared-backend/database';
import { UserEntity } from './entities/User.js';

const AppDataSource = createDataSource({
  entities: [UserEntity],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
});

export default AppDataSource;