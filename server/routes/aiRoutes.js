const express = require("express");
const router = express.Router();
const {
  suggestTasks,
  getWeeklySummary,
  taskChat,
} = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

router.post("/suggest-tasks", protect, suggestTasks);
router.post("/weekly-summary", protect, getWeeklySummary);
router.post("/chat", protect, taskChat);

module.exports = router;
