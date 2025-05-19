require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const aiRoutes = require("./routes/aiRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");
//
// const cookieParser = require("cookie-parser");
// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// app.use(cookieParser);

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("mongoDB connected..."))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/ai", aiRoutes);

app.use(errorHandler);

//Error handeling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
