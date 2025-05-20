const asyncHandler = require("express-async-handler");
const Todo = require("../models/Todo");

// @desc    Get all todos for a user
// @route   GET /api/todos
// @access  Private
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

// @desc    Create a new todo
// @route   POST /api/todos
// @access  Private
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

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Private
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

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
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
