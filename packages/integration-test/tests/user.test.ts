import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from 'migrations/src/entities/User.js';
import { setupTestDatabase, cleanupTestDatabase, getTestDataSource } from '../src/setup/database.js';

describe('User Entity Integration Tests', () => {
  let dataSource: DataSource;
  let userRepository: Repository<UserEntity>;

  beforeAll(async () => {
    dataSource = await setupTestDatabase();
    userRepository = dataSource.getRepository(UserEntity);
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  beforeEach(async () => {
    // Clear users table before each test
    await userRepository.clear();
  });

  it('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      username: 'testuser',
      passwordHash: 'hashedpassword123',
      emailConfirmed: false,
      role: 'user' as const
    };

    const user = userRepository.create(userData);
    const savedUser = await userRepository.save(user);

    expect(savedUser.id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.passwordHash).toBe(userData.passwordHash);
    expect(savedUser.emailConfirmed).toBe(false);
    expect(savedUser.role).toBe('user');
    expect(savedUser.createdAt).toBeInstanceOf(Date);
    expect(savedUser.updatedAt).toBeInstanceOf(Date);
  });

  it('should find user by email', async () => {
    const userData = {
      email: 'findme@example.com',
      username: 'finduser',
      passwordHash: 'hashedpassword123',
      emailConfirmed: false,
      role: 'user' as const
    };

    const user = userRepository.create(userData);
    await userRepository.save(user);

    const foundUser = await userRepository.findOne({
      where: { email: userData.email }
    });

    expect(foundUser).toBeDefined();
    expect(foundUser?.email).toBe(userData.email);
    expect(foundUser?.username).toBe(userData.username);
    expect(foundUser?.emailConfirmed).toBe(false);
    expect(foundUser?.role).toBe('user');
  });

  it('should find user by username', async () => {
    const userData = {
      email: 'findbyusername@example.com',
      username: 'uniqueuser',
      passwordHash: 'hashedpassword123',
      emailConfirmed: false,
      role: 'user' as const
    };

    const user = userRepository.create(userData);
    await userRepository.save(user);

    const foundUser = await userRepository.findOne({
      where: { username: userData.username }
    });

    expect(foundUser).toBeDefined();
    expect(foundUser?.email).toBe(userData.email);
    expect(foundUser?.username).toBe(userData.username);
    expect(foundUser?.emailConfirmed).toBe(false);
    expect(foundUser?.role).toBe('user');
  });

  it('should enforce unique email constraint', async () => {
    const userData1 = {
      email: 'duplicate@example.com',
      username: 'user1',
      passwordHash: 'hashedpassword123',
      emailConfirmed: false,
      role: 'user' as const
    };

    const userData2 = {
      email: 'duplicate@example.com',
      username: 'user2',
      passwordHash: 'hashedpassword123',
      emailConfirmed: false,
      role: 'user' as const
    };

    const user1 = userRepository.create(userData1);
    await userRepository.save(user1);

    const user2 = userRepository.create(userData2);
    
    await expect(userRepository.save(user2)).rejects.toThrow();
  });

  it('should enforce unique username constraint', async () => {
    const userData1 = {
      email: 'user1@example.com',
      username: 'duplicateuser',
      passwordHash: 'hashedpassword123',
      emailConfirmed: false,
      role: 'user' as const
    };

    const userData2 = {
      email: 'user2@example.com',
      username: 'duplicateuser',
      passwordHash: 'hashedpassword123',
      emailConfirmed: false,
      role: 'user' as const
    };

    const user1 = userRepository.create(userData1);
    await userRepository.save(user1);

    const user2 = userRepository.create(userData2);
    
    await expect(userRepository.save(user2)).rejects.toThrow();
  });

  it('should update user timestamps on save', async () => {
    const userData = {
      email: 'timestamp@example.com',
      username: 'timestampuser',
      passwordHash: 'hashedpassword123',
      emailConfirmed: false,
      role: 'user' as const
    };

    const user = userRepository.create(userData);
    const savedUser = await userRepository.save(user);
    const originalUpdatedAt = savedUser.updatedAt;

    // Wait a small amount to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 10));

    savedUser.email = 'updated@example.com';
    const updatedUser = await userRepository.save(savedUser);

    expect(updatedUser.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    expect(updatedUser.createdAt).toEqual(savedUser.createdAt);
  });

  it('should delete user', async () => {
    const userData = {
      email: 'deleteme@example.com',
      username: 'deleteuser',
      passwordHash: 'hashedpassword123',
      emailConfirmed: false,
      role: 'user' as const
    };

    const user = userRepository.create(userData);
    const savedUser = await userRepository.save(user);

    await userRepository.delete(savedUser.id);

    const deletedUser = await userRepository.findOne({
      where: { id: savedUser.id }
    });

    expect(deletedUser).toBeNull();
  });

  it('should count users', async () => {
    const users = [
      { email: 'count1@example.com', username: 'countuser1', passwordHash: 'hash1', emailConfirmed: false, role: 'user' as const },
      { email: 'count2@example.com', username: 'countuser2', passwordHash: 'hash2', emailConfirmed: false, role: 'user' as const },
      { email: 'count3@example.com', username: 'countuser3', passwordHash: 'hash3', emailConfirmed: true, role: 'admin' as const }
    ];

    for (const userData of users) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
    }

    const count = await userRepository.count();
    expect(count).toBe(3);
  });
});