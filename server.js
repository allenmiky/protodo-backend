import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // ✅ use cors package
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import boardRoutes from "./routes/boards.js";

dotenv.config();
connectDB();

const app = express();

/* ✅ Smart & Flexible CORS Configuration */
const allowedOrigins = [
  "http://localhost:5173", // vite dev
  "http://localhost:3000", // react dev
  /\.vercel\.app$/,        // ✅ any vercel frontend
  /\.netlify\.app$/,       // ✅ any netlify frontend
  /\.onrender\.com$/,      // ✅ any render frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow mobile/postman etc.
      if (allowedOrigins.some((pattern) => pattern instanceof RegExp ? pattern.test(origin) : pattern === origin)) {
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

/* ✅ Error Middleware */
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ error: err.message });
});

/* ✅ Port Setup */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
