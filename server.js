import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import boardRoutes from "./routes/boards.js";

dotenv.config();
connectDB();

const app = express();

/* --------------------------- ✅ CORS FIX SECTION --------------------------- */
// This manual middleware handles dynamic origins (ngrok, localhost, etc.)
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (
    origin &&
    (origin.includes("ngrok-free.dev") ||
      origin.includes("localhost") ||
      origin.includes("127.0.0.1"))
  ) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // ✅ Added PATCH here
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});


/* -------------------------------------------------------------------------- */

// ✅ Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/boards", boardRoutes);

// ✅ Root route for quick health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "🚀 ProTodo Backend is running successfully!",
  });
});

// ✅ Default 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Port setup for Railway / Local
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
