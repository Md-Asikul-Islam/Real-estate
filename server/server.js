import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import authRouter from "./routes/authRoute.js";
import passport from "./config/passport.js";
import router from "./routes/OauthRoute.js";
import propertyRouter from "./routes/propertyRoute.js";
import userRouter from "./routes/userRoute.js";

dotenv.config();
const app = express();

// Connect Database
connectDB();

// Global Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // e.g., http://localhost:5173
    credentials: true,
    methods: ["GET", "POST", "PUT","PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/oauth", router);
app.use("/api/users", userRouter);
app.use("/api/properties", propertyRouter);

// Error handling middleware
app.use(errorHandler);
// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
