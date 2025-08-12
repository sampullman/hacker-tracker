import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  Index 
} from 'typeorm';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

@Entity('users')
@Index(['email'], { unique: true })
@Index(['username'], { unique: true })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  username!: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash!: string;

  @Column({ type: 'boolean', default: false })
  emailConfirmed!: boolean;

  @Column({ type: 'varchar', length: 20, default: 'user' })
  role!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}