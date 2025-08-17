import { createDataSource } from 'shared-backend/database';
import { UserEntity } from './entities/User.js';
import { EmailConfirmationEntity } from './entities/EmailConfirmation.js';

const AppDataSource = createDataSource({
  entities: [UserEntity, EmailConfirmationEntity],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
});

export default AppDataSource;