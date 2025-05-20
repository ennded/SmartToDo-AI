const request = require("supertest");
const app = require("../app");
const { openai } = require("../config/openai");

jest.mock("openai", () => {
  const mockCreateChatCompletion = jest.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: JSON.stringify([
            { title: "Mock Task", dueDate: "2023-12-31", priority: "High" },
          ]),
        },
      },
    ],
  });

  return {
    OpenAI: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreateChatCompletion,
        },
      },
    })),
  };
});

let token;

beforeAll(async () => {
  await request(app).post("/api/auth/register").send({
    name: "Test User",
    email: "testuser@example.com",
    password: "testpassword",
  });

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "testuser@example.com", password: "testpassword" });

  token = res.body.token;

  if (!token) {
    throw new Error("Login failed: No token received");
  }
});

describe("AI Service", () => {
  test("Generate task suggestions", async () => {
    openai.chat.completions.create.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify([
              { title: "Mock Task", dueDate: "2023-12-31", priority: "High" },
            ]),
          },
        },
      ],
    });

    const res = await request(app)
      .post("/api/ai/suggest-tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ input: "test input" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([
      { title: "Mock Task", dueDate: "2023-12-31", priority: "High" },
    ]);
  });
});
