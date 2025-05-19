const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();

//middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser);

//test  route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

//Error handeling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

module.exports = { app, prisma };
