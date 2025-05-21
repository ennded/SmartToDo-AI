require("dotenv").config();
require("./config/passport");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const morgan = require("morgan");
const MongoStore = require("connect-mongo");

const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const aiRoutes = require("./routes/aiRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

console.log(
  "Loaded Mongo URI:",
  process.env.MONGODB_URI || process.env.DATABASE_URL
);

// CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://smart-to-do-hi0qc599i-enndeds-projects.vercel.app"
        : "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());

// Session Config
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-dev-secret-123",
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URL,
      autoRemove: "interval",
      autoRemoveInterval: 10,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

// Other Middleware
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("dev"));

// MongoDB Connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("mongoDB connected..."))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/ai", aiRoutes);
app.get("/", (req, res) => {
  res.send("SmartToDo AI backend is running 🚀");
});
// Error Handling
app.use(errorHandler);

module.exports = app;
