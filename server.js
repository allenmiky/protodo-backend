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

// ✅ Flexible CORS for frontend (local + vercel + netlify + render)
const allowedOrigins = [
  "http://localhost:5173", // Vite dev
  "http://localhost:5000", // React dev
  /\.vercel\.app$/,        // any vercel frontend
  /\.netlify\.app$/,       // any netlify frontend
  /\.onrender\.com$/,      // any render frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow Postman / mobile apps
      if (
        allowedOrigins.some((pattern) =>
          pattern instanceof RegExp ? pattern.test(origin) : pattern === origin
        )
      ) {
        callback(null, true);
      } else {
        console.warn("🚫 Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  })
);

// ✅ Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/boards", boardRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "🚀 Backend running fine!" });
});

// ✅ 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ error: err.message });
});

// ✅ Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
