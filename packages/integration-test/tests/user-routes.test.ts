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

describe("User Routes Integration Tests", () => {
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

  const createTestUser = async (
    role: "user" | "admin" = "user",
    emailConfirmed = false
  ) => {
    const passwordHash = await bcrypt.hash("password123", 12);
    const user = userRepository.create({
      email: role === "admin" ? "admin@example.com" : "user@example.com",
      username: role === "admin" ? "adminuser" : "regularuser",
      passwordHash,
      emailConfirmed,
      role,
    });
    return userRepository.save(user);
  };

  const getAuthToken = async (role: "user" | "admin" = "user") => {
    const timestamp = Date.now();
    const email =
      role === "admin"
        ? `admin${timestamp}@example.com`
        : `user${timestamp}@example.com`;
    const username =
      role === "admin" ? `adminuser${timestamp}` : `regularuser${timestamp}`;

    const response = await request
      .post("/api/auth/register")
      .send({
        email,
        username,
        password: "password123",
      })
      .expect(201);

    if (role === "admin") {
      // Find the user by email and update role
      const user = await userRepository.findOne({ where: { email } });
      if (user) {
        user.role = "admin";
        await userRepository.save(user);

        // Get a fresh token with the admin user
        const loginResponse = await request
          .post("/api/auth/login")
          .send({
            email,
            password: "password123",
          })
          .expect(200);

        return { token: loginResponse.body.data.token, email, username };
      }
    }

    return { token: response.body.data.token, email, username };
  };

  describe("GET /api/users", () => {
    it("should return all users for admin", async () => {
      await createTestUser("user");
      await createTestUser("admin");
      const { token } = await getAuthToken("admin");

      const response = await request
        .get("/api/users")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.data).toHaveLength(3);
      expect(response.body.data[0]).toHaveProperty("email");
      expect(response.body.data[0]).toHaveProperty("username");
      expect(response.body.data[0]).not.toHaveProperty("passwordHash");
    });

    it("should reject access for regular user", async () => {
      const { token } = await getAuthToken("user");

      const response = await request
        .get("/api/users")
        .set("Authorization", `Bearer ${token}`)
        .expect(403);

      expect(response.body.error).toBe("Insufficient permissions");
    });

    it("should reject access without token", async () => {
      const response = await request.get("/api/users").expect(401);

      expect(response.body.error).toBe("Access token required");
    });
  });

  describe("GET /api/users/:id", () => {
    it("should allow user to view their own profile", async () => {
      const { token, email, username } = await getAuthToken("user");
      const user = await userRepository.findOne({ where: { email } });

      const response = await request
        .get(`/api/users/${user!.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.data.email).toBe(email);
      expect(response.body.data.username).toBe(username);
      expect(response.body.data).not.toHaveProperty("passwordHash");
    });

    it("should allow admin to view any user profile", async () => {
      const regularUser = await createTestUser("user");
      const { token } = await getAuthToken("admin");

      const response = await request
        .get(`/api/users/${regularUser.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.data.email).toBe(regularUser.email);
      expect(response.body.data.username).toBe(regularUser.username);
    });

    it("should reject user viewing other user profile", async () => {
      const otherUser = await createTestUser("user");
      const { token, email } = await getAuthToken("admin"); // Create admin token but test with different user

      // Change the admin user back to regular user
      const adminUser = await userRepository.findOne({ where: { email } });
      if (adminUser) {
        adminUser.role = "user";
        await userRepository.save(adminUser);
      }

      const response = await request
        .get(`/api/users/${otherUser.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(403);

      expect(response.body.error).toBe("Access denied");
    });

    it("should return 404 for non-existent user", async () => {
      const { token } = await getAuthToken("admin");

      const response = await request
        .get("/api/users/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      expect(response.body.error).toBe("User not found");
    });
  });

  describe("PUT /api/users/:id", () => {
    it("should allow user to update their own username", async () => {
      const { token, email } = await getAuthToken("user");
      const user = await userRepository.findOne({ where: { email } });

      const response = await request
        .put(`/api/users/${user!.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ username: "newusername" })
        .expect(200);

      expect(response.body.data.username).toBe("newusername");
    });

    it("should allow admin to update user role and email confirmation", async () => {
      const regularUser = await createTestUser("user");
      const { token } = await getAuthToken("admin");

      const response = await request
        .put(`/api/users/${regularUser.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          role: "admin",
          emailConfirmed: true,
        })
        .expect(200);

      expect(response.body.data.role).toBe("admin");
      expect(response.body.data.emailConfirmed).toBe(true);
    });

    it("should reject regular user updating role or email confirmation", async () => {
      const { token, email } = await getAuthToken("user");
      const user = await userRepository.findOne({ where: { email } });

      const response = await request
        .put(`/api/users/${user!.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          role: "admin",
          emailConfirmed: true,
        })
        .expect(200);

      // Regular users can't update role/emailConfirmed, so these should remain unchanged
      expect(response.body.data.role).toBe("user");
      expect(response.body.data.emailConfirmed).toBe(false);
    });

    it("should reject username update with existing username", async () => {
      await createTestUser("user");
      const secondUser = await createTestUser("admin");
      const { token } = await getAuthToken("admin");

      const response = await request
        .put(`/api/users/${secondUser.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ username: "regularuser" })
        .expect(400);

      expect(response.body.error).toBe("Username already taken");
    });

    it("should return 404 for non-existent user", async () => {
      const { token } = await getAuthToken("admin");

      const response = await request
        .put("/api/users/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${token}`)
        .send({ username: "newname" })
        .expect(404);

      expect(response.body.error).toBe("User not found");
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("should allow admin to delete user", async () => {
      const regularUser = await createTestUser("user");
      const { token } = await getAuthToken("admin");

      const response = await request
        .delete(`/api/users/${regularUser.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.data.message).toBe("User deleted successfully");

      const deletedUser = await userRepository.findOne({
        where: { id: regularUser.id },
      });
      expect(deletedUser).toBeNull();
    });

    it("should reject regular user deleting users", async () => {
      const otherUser = await createTestUser("admin");
      const { token } = await getAuthToken("user");

      const response = await request
        .delete(`/api/users/${otherUser.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(403);

      expect(response.body.error).toBe("Insufficient permissions");
    });

    it("should return 404 for non-existent user", async () => {
      const { token } = await getAuthToken("admin");

      const response = await request
        .delete("/api/users/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      expect(response.body.error).toBe("User not found");
    });
  });
});
