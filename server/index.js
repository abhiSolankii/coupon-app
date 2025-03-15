import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import couponRoutes from "./routes/couponRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Parse frontend URLs from environment variables into an array
const allowedOrigins = [
  process.env.FRONTEND_LOCAL_URL,
  process.env.FRONTEND_PRODUCTION_URL,
].filter((url) => url); // Remove undefined or empty URLs

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if the incoming origin is in the allowedOrigins array
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/coupons", couponRoutes);
app.use("/api/admin", adminRoutes);

//check if server is live
app.get("/", (req, res) => {
  res.send("Server is live");
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
