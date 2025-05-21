const asyncHandler = require("express-async-handler");
const Todo = require("../models/Todo");

// @route GET /api/todos
const getTodos = asyncHandler(async (req, res) => {
  const { status, priority, sort, tags } = req.query;
  const userId = req.user._id;

  // Build filter object
  const filter = { user: userId };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (tags) filter.tags = { $in: tags.split(",") };

  // Build sort object
  let sortOptions = {};
  if (sort === "dueDate") {
    sortOptions.dueDate = 1; // Ascending
  } else if (sort === "priority") {
    // Custom priority sorting (High > Medium > Low)
    sortOptions.priority = -1;
  } else {
    sortOptions.createdAt = -1; // Newest first
  }

  const todos = await Todo.find(filter).sort(sortOptions);
  res.json(todos);
});

// @route POST /api/todos
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
    tags: tags || [],
    user: req.user._id,
  });

  res.status(201).json(todo);
});

// @route PUT /api/todos/:id
const updateTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) {
    res.status(404);
    throw new Error("Todo not found");
  }

  // Check ownership
  if (todo.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const updatedTodo = await Todo.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title || todo.title,
      status: req.body.status || todo.status,
      priority: req.body.priority || todo.priority,
      dueDate: req.body.dueDate || todo.dueDate,
      tags: req.body.tags || todo.tags,
    },
    { new: true } // Return updated document
  );

  res.json(updatedTodo);
});

// @route DELETE /api/todos/:id
const deleteTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) {
    res.status(404);
    throw new Error("Todo not found");
  }

  // Check ownership
  if (todo.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await todo.deleteOne();
  res.json({ message: "Todo deleted successfully" });
});

module.exports = { getTodos, createTodo, updateTodo, deleteTodo };
