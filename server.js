import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import boardRoutes from "./routes/boards.js";

dotenv.config();
connectDB();

const app = express();

// ✅ Use CORS with multiple allowed origins
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.includes("ngrok-free.dev") || origin.includes("localhost")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


// ✅ Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/boards", boardRoutes);

// ✅ Root route for quick health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "ProTodo Backend is running!" });
});

// ✅ Port for Railway
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
