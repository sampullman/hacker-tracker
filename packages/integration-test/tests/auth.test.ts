import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import supertest from "supertest";
import { DataSource, Repository } from "typeorm";
import { UserEntity } from "migrations/src/entities/User";
import {
  setupTestDatabase,
  cleanupTestDatabase,
} from "../src/setup/database";
import { createApp } from "backend/src/index";
import bcrypt from "bcrypt";
import TestAgent from "supertest/lib/agent";

describe("Authentication Integration Tests", () => {
  let app: any;
  let request: TestAgent;
  let dataSource: DataSource;
  let userRepository: Repository<UserEntity>;

  beforeAll(async () => {
    dataSource = await setupTestDatabase();
    userRepository = dataSource.getRepository(UserEntity);
    app = await createApp();
    request = supertest(app);
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  beforeEach(async () => {
    await userRepository.clear();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        email: "test@example.com",
        username: "testuser",
        password: "password123",
      };

      const response = await request
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.username).toBe(userData.username);
      expect(response.body.data.user.emailConfirmed).toBe(false);
      expect(response.body.data.user.role).toBe("user");
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.passwordHash).toBeUndefined();
    });

    it("should hash the password correctly", async () => {
      const userData = {
        email: "test@example.com",
        username: "testuser",
        password: "password123",
      };

      await request.post("/api/auth/register").send(userData).expect(201);

      const user = await userRepository.findOne({
        where: { email: userData.email },
      });

      expect(user).toBeDefined();
      expect(user!.passwordHash).not.toBe(userData.password);
      expect(user!.passwordHash.length).toBeGreaterThan(50);
    });

    it("should reject registration with missing fields", async () => {
      const response = await request
        .post("/api/auth/register")
        .send({
          email: "test@example.com",
        })
        .expect(400);

      expect(response.body.error).toBe(
        "Email, username, and password are required"
      );
    });

    it("should reject registration with short password", async () => {
      const response = await request
        .post("/api/auth/register")
        .send({
          email: "test@example.com",
          username: "testuser",
          password: "123",
        })
        .expect(400);

      expect(response.body.error).toBe(
        "Password must be at least 8 characters long"
      );
    });

    it("should reject registration with duplicate email", async () => {
      const userData = {
        email: "test@example.com",
        username: "testuser1",
        password: "password123",
      };

      await request.post("/api/auth/register").send(userData).expect(201);

      const duplicateData = {
        email: "test@example.com",
        username: "testuser2",
        password: "password123",
      };

      const response = await request
        .post("/api/auth/register")
        .send(duplicateData)
        .expect(400);

      expect(response.body.error).toBe("User with this email already exists");
    });

    it("should reject registration with duplicate username", async () => {
      const userData = {
        email: "test1@example.com",
        username: "testuser",
        password: "password123",
      };

      await request.post("/api/auth/register").send(userData).expect(201);

      const duplicateData = {
        email: "test2@example.com",
        username: "testuser",
        password: "password123",
      };

      const response = await request
        .post("/api/auth/register")
        .send(duplicateData)
        .expect(400);

      expect(response.body.error).toBe(
        "User with this username already exists"
      );
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      const password = "password123";
      const passwordHash = await bcrypt.hash(password, 12);

      const user = userRepository.create({
        email: "test@example.com",
        username: "testuser",
        passwordHash,
        emailConfirmed: false,
        role: "user" as const,
      });

      await userRepository.save(user);

      const response = await request
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "password123",
        })
        .expect(200);

      expect(response.body.data.user.email).toBe("test@example.com");
      expect(response.body.data.user.username).toBe("testuser");
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.passwordHash).toBeUndefined();
    });

    it("should reject login with invalid email", async () => {
      const response = await request
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123",
        })
        .expect(401);

      expect(response.body.error).toBe("Invalid email or password");
    });

    it("should reject login with invalid password", async () => {
      const passwordHash = await bcrypt.hash("password123", 12);

      const user = userRepository.create({
        email: "test@example.com",
        username: "testuser",
        passwordHash,
        emailConfirmed: false,
        role: "user" as const,
      });

      await userRepository.save(user);

      const response = await request
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body.error).toBe("Invalid email or password");
    });

    it("should reject login with missing fields", async () => {
      const response = await request
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
        })
        .expect(400);

      expect(response.body.error).toBe("Email and password are required");
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should logout successfully", async () => {
      const response = await request.post("/api/auth/logout").expect(200);

      expect(response.body.data.message).toBe("Logged out successfully");
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return user info with valid token", async () => {
      const registerResponse = await request
        .post("/api/auth/register")
        .send({
          email: "test@example.com",
          username: "testuser",
          password: "password123",
        })
        .expect(201);

      const token = registerResponse.body.data.token;

      const response = await request
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.data.email).toBe("test@example.com");
      expect(response.body.data.username).toBe("testuser");
      expect(response.body.data.passwordHash).toBeUndefined();
    });

    it("should reject request without token", async () => {
      const response = await request.get("/api/auth/me").expect(401);

      expect(response.body.error).toBe("Access token required");
    });

    it("should reject request with invalid token", async () => {
      const response = await request
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token")
        .expect(403);

      expect(response.body.error).toBe("Invalid token");
    });
  });
});
