const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["To Do", "In Progress", "Done"],
    default: "To Do",
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  dueDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

todoSchema.virtual("isOverdue").get(function () {
  return this.dueDate && this.status !== "Done" && this.dueDate < new Date();
});

todoSchema.virtual("isDueToday").get(function () {
  if (!this.dueDate) return false;
  const today = new Date();
  return (
    this.dueDate.getDate() === today.getDate() &&
    this.dueDate.getMonth() === today.getMonth() &&
    this.dueDate.getFullYear() === today.getFullYear() &&
    this.status !== "Done"
  );
});
module.exports = mongoose.model("Todo", todoSchema);
