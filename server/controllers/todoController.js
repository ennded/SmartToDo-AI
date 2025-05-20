const asyncHandler = require("express-async-handler");
const Todo = require("../models/Todo");

// @route   GET /api/todos
const getTodos = asyncHandler(async (req, res) => {
  const { status, priority, sort, tags } = req.query;

  const query = { user: req.user._id };

  if (status) {
    query.status = status;
  }

  if (priority) {
    query.priority = priority;
  }

  if (tags) {
    query.tags = { $in: tags.split(",") };
  }

  let sortOption = { createdAt: -1 };

  if (sort === "dueDate") {
    sortOption = { dueDate: 1 };
  } else if (sort === "priority") {
    sortOption = { priority: -1 };
  }

  const todos = await Todo.find(query).sort(sortOption);
  res.json(todos);
});

// @route   POST /api/todos
const createTodo = asyncHandler(async (req, res) => {
  const { title, status, priority, dueDate, tags } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }

  const todo = await Todo.create({
    title,
    status: status || "To Do",
    priority: priority || "Medium",
    dueDate,
    user: req.user._id,
    tags: tags || [],
  });

  res.status(201).json(todo);
});

// @route   PUT /api/todos/:id
const updateTodo = asyncHandler(async (req, res) => {
  const { title, status, priority, dueDate } = req.body;

  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    res.status(404);
    throw new Error("Todo not found");
  }

  if (todo.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to update this todo");
  }

  todo.title = title || todo.title;
  todo.status = status || todo.status;
  todo.priority = priority || todo.priority;
  todo.dueDate = dueDate || todo.dueDate;

  const updatedTodo = await todo.save();
  res.json(updatedTodo);
});

// @route   DELETE /api/todos/:id
const deleteTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    res.status(404);
    throw new Error("Todo not found");
  }

  if (todo.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to delete this todo");
  }

  await todo.deleteOne();
  res.json({ message: "Todo removed" });
});

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
