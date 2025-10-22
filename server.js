import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import boardRoutes from "./routes/boards.js";

dotenv.config();
connectDB();

const app = express();

/* ✅ CORS FIX — Allow Serveo, Vercel, and localhost */
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // ✅ Allowed origins list
  const allowedOrigins = [
    "https://proto-frontend-omega.vercel.app",
    "https://vercel.app",
    "https://localhost:5173",
    "https://127.0.0.1:5173",
    "https://ngrok-free.dev",
    "https://serveo.net"
  ];

  if (allowedOrigins.some((allowed) => origin && origin.includes(allowed))) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

/* ✅ Body Parsers */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ✅ Routes */
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/boards", boardRoutes);

/* ✅ Health Check Route */
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "🚀 Backend running fine!" });
});

/* ✅ Default 404 */
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/* ✅ Port Setup */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
