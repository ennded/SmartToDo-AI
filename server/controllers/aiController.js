const asyncHandler = require("express-async-handler");
const OpenAI = require("openai");
const Todo = require("../models/Todo");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Get AI task suggestions
// @route   POST /api/ai/suggest-tasks
// @access  Private
const suggestTasks = asyncHandler(async (req, res) => {
  const { input } = req.body;

  if (!input) {
    res.status(400);
    throw new Error("Input is required");
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
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    const tasks = JSON.parse(content);

    res.json(tasks);
  } catch (err) {
    console.error("OpenAI API error:", err);
    res.status(500);
    throw new Error("Failed to get AI suggestions");
  }
});

// @desc    Get weekly summary
// @route   POST /api/ai/weekly-summary
// @access  Private
const getWeeklySummary = asyncHandler(async (req, res) => {
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

  const prompt = `
    Summarize the following completed tasks for the past week in a human-readable paragraph.
    Highlight key achievements and patterns if any.
    
    Completed tasks:
    ${todos
      .map((todo) => `- ${todo.title} (${todo.priority} priority)`)
      .join("\n")}
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    const summary = response.choices[0].message.content;
    res.json({ summary });
  } catch (err) {
    console.error("OpenAI API error:", err);
    res.status(500);
    throw new Error("Failed to generate weekly summary");
  }
});

// @desc    Get AI answers about tasks
// @route   POST /api/ai/chat
// @access  Private
const taskChat = asyncHandler(async (req, res) => {
  const { question } = req.body;

  if (!question) {
    res.status(400);
    throw new Error("Question is required");
  }

  const todos = await Todo.find({ user: req.user._id });

  const prompt = `
    Based on the following list of tasks, answer the user's question.
    Be concise and helpful in your response.
    
    User's question: "${question}"
    
    User's tasks:
    ${todos
      .map(
        (todo) =>
          `- ${todo.title} (Status: ${todo.status}, Priority: ${
            todo.priority
          }, Due: ${todo.dueDate || "No due date"})`
      )
      .join("\n")}
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const answer = response.choices[0].message.content;
    res.json({ answer });
  } catch (err) {
    console.error("OpenAI API error:", err);
    res.status(500);
    throw new Error("Failed to get AI response");
  }
});

module.exports = {
  suggestTasks,
  getWeeklySummary,
  taskChat,
};
