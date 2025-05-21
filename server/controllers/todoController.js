const asyncHandler = require("express-async-handler");
const Todo = require("../models/Todo");
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  process.env.SUPABASE_URL || "https://vchlrffxvafmyrlvwvup.supabase.co",
  process.env.SUPABASE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjaGxyZmZ4dmFmbXlybHZ3dnVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NjgxMDgsImV4cCI6MjA2MzM0NDEwOH0.0fzusl9X7gHzBJGYL1ijDrHV1pjNIq3kyTl4jTgHlK8"
);

// @route GET /api/todos
const getTodos = asyncHandler(async (req, res) => {
  const { status, priority, sort, tags } = req.query;
  const userId = req.user._id; // assuming you have user auth middleware

  let query = supabase.from("todos").select("*").eq("user_id", userId);

  if (status) {
    query = query.eq("status", status);
  }
  if (priority) {
    query = query.eq("priority", priority);
  }
  if (tags) {
    const tagsArray = tags.split(",");
    query = query.overlaps("tags", tagsArray); // assuming "tags" is a Postgres array column
  }

  // Sorting
  if (sort === "dueDate") {
    query = query.order("due_date", { ascending: true });
  } else if (sort === "priority") {
    query = query.order("priority", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    res.status(500);
    throw new Error(error.message);
  }
  res.json(data);
});

// @route POST /api/todos
const createTodo = asyncHandler(async (req, res) => {
  const { title, status, priority, dueDate, tags } = req.body;
  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }

  const { data, error } = await supabase
    .from("todos")
    .insert([
      {
        title,
        status: status || "To Do",
        priority: priority || "Medium",
        due_date: dueDate,
        user_id: req.user._id,
        tags: tags || [],
      },
    ])
    .select()
    .single();

  if (error) {
    res.status(500);
    throw new Error(error.message);
  }
  res.status(201).json(data);
});

// @route PUT /api/todos/:id
const updateTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, status, priority, dueDate, tags } = req.body;

  // Fetch the todo first to check ownership
  let { data: todo, error } = await supabase
    .from("todos")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !todo) {
    res.status(404);
    throw new Error("Todo not found");
  }

  if (todo.user_id !== req.user._id) {
    res.status(401);
    throw new Error("Not authorized to update this todo");
  }

  const { data, error: updateError } = await supabase
    .from("todos")
    .update({
      title: title || todo.title,
      status: status || todo.status,
      priority: priority || todo.priority,
      due_date: dueDate || todo.due_date,
      tags: tags || todo.tags,
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    res.status(500);
    throw new Error(updateError.message);
  }

  res.json(data);
});

// @route DELETE /api/todos/:id
const deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Fetch to check ownership
  const { data: todo, error } = await supabase
    .from("todos")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !todo) {
    res.status(404);
    throw new Error("Todo not found");
  }

  if (todo.user_id !== req.user._id) {
    res.status(401);
    throw new Error("Not authorized to delete this todo");
  }

  const { error: deleteError } = await supabase
    .from("todos")
    .delete()
    .eq("id", id);

  if (deleteError) {
    res.status(500);
    throw new Error(deleteError.message);
  }

  res.json({ message: "Todo removed" });
});

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
