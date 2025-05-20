const asyncHandler = require("express-async-handler");
const OpenAI = require("openai");
const Todo = require("../models/Todo");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let availableModels = [];

async function listModels() {
  try {
    const models = await openai.models.list();
    availableModels = models.data.map((m) => m.id);
    console.log("Available OpenAI Models:", availableModels);
  } catch (err) {
    console.error("Failed to fetch models list:", err);

    availableModels = ["gpt-3.5-turbo", "gpt-4"];
  }
}

listModels();

// @route   POST /api/ai/suggest-tasks

const suggestTasks = asyncHandler(async (req, res) => {
  const { input } = req.body;

  if (!input || typeof input !== "string") {
    res.status(400).json({ error: "Valid input is required" });
    return;
  }

  const prompt = `
    Convert the following sentence into a structured list of tasks with appropriate titles and due dates.
    For each task, suggest a priority (Low, Medium, High) and status (To Do, In Progress, Done).
    Return the response as a JSON array of objects with the following fields: title, dueDate, priority, status.
    
    Input: "${input}"
    
    Example response format:
    [
      {
        "title": "Book flight tickets",
        "dueDate": "2023-12-15",
        "priority": "High",
        "status": "To Do"
      },
      {
        "title": "Finish presentation",
        "dueDate": "2023-12-14",
        "priority": "Medium",
        "status": "In Progress"
      }
    ]
  `;

  try {
    const model = availableModels.includes("gpt-3.5-turbo")
      ? "gpt-3.5-turbo"
      : availableModels[0] || "gpt-3.5-turbo";

    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;

    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    console.log("🧠 OpenAI Response:", content);

    try {
      const tasks = JSON.parse(content);
      res.json(tasks);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      const fallbackTasks = content
        .split("\n")
        .filter((line) => line.trim().startsWith("-"))
        .map((task) => ({
          title: task.replace("-", "").trim(),
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          priority: "Medium",
          status: "To Do",
        }));
      res.json(fallbackTasks);
    }
  } catch (err) {
    console.error("OpenAI API error:", err);

    const fallbackResponse = [
      {
        title: "Research flight options",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        priority: "High",
        status: "To Do",
      },
      {
        title: "Create presentation outline",
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        priority: "Medium",
        status: "In Progress",
      },
    ];
    if (err.status === 429) {
      res.status(429).json({
        error: "API quota exceeded. Using fallback suggestions.",
        suggestions: fallbackResponse,
        warning: "Please check your OpenAI billing",
      });
    } else {
      res.status(500).json({
        error: "API Error. Using fallback suggestions.",
        suggestions: fallbackResponse,
      });
    }
  }
});

// @route   POST /api/ai/weekly-summary

const getWeeklySummary = asyncHandler(async (req, res) => {
  try {
    const todos = await Todo.find({
      user: req.user._id,
      status: "Done",
      createdAt: {
        $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
      },
    });

    if (todos.length === 0) {
      res.json({ summary: "No completed tasks this week." });
      return;
    }

    const prompt = `...`;

    try {
      const model = availableModels.includes("gpt-3.5-turbo")
        ? "gpt-3.5-turbo"
        : availableModels[0] || "gpt-3.5-turbo";

      const response = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        max_tokens: 300,
      });

      const summary = response.choices[0]?.message?.content;
      res.json({ summary });
    } catch (apiError) {
      console.error("OpenAI API error:", apiError);
      const manualSummary = `You completed ${
        todos.length
      } tasks this week including: ${todos
        .slice(0, 3)
        .map((t) => t.title)
        .join(", ")}${todos.length > 3 ? " and more" : ""}.`;
      res.json({ summary: manualSummary });
    }
  } catch (dbError) {
    console.error("Database error:", dbError);
    res.status(500).json({ error: "Failed to fetch weekly summary data" });
  }
});

// @route   POST /api/ai/chat

const taskChat = asyncHandler(async (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== "string") {
    res.status(400).json({ error: "Valid question is required" });
    return;
  }

  try {
    const todos = await Todo.find({ user: req.user._id });
    const prompt = `...`;

    try {
      const model = availableModels.includes("gpt-3.5-turbo")
        ? "gpt-3.5-turbo"
        : availableModels.includes("gpt-4")
        ? "gpt-4"
        : availableModels[0];

      const response = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 400,
      });

      const answer = response.choices[0]?.message?.content;
      res.json({ answer });
    } catch (apiError) {
      console.error("OpenAI API error:", apiError);

      const basicAnswer =
        `I can't access AI right now. Based on your ${todos.length} tasks, ` +
        `you might want to check ${
          todos.filter((t) => t.status !== "Done").length
        } pending items.`;
      res.json({ answer: basicAnswer });
    }
  } catch (dbError) {
    console.error("Database error:", dbError);
    res.status(500).json({ error: "Failed to fetch task data" });
  }
});
module.exports = {
  suggestTasks,
  getWeeklySummary,
  taskChat,
};
