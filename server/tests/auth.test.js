const request = require("supertest");
const app = require("../app");
const User = require("../models/User");

describe("Auth API", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test("Register new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
  });

  test("Login existing user", async () => {
    await User.create({ email: "test@example.com", password: "password123" });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });
});
