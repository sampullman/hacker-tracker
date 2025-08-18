import { createDataSource } from 'shared-backend/database';
import { UserEntity } from './entities/User';
import { EmailConfirmationEntity } from './entities/EmailConfirmation';

const AppDataSource = createDataSource({
  entities: [UserEntity, EmailConfirmationEntity],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
});

export default AppDataSource;