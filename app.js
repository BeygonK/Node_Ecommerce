// app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";

// Route imports
//import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// Middleware
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import cookieParser from "cookie-parser";

dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

connectDB();

const app = express();

// Global middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
//app.use(notFound);
app.use(errorHandler);
app.use(cookieParser());

// Apply globally
app.use(apiLimiter);

app.use("/api/orders", orderRoutes);

// Routes
//app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Error handler
//app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
export default app;
