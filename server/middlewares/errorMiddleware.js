import AppError from "../utils/AppError.js";
// Send error in development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};
// Send error in production
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR:", err);
    res.status(500).json({
      success: false,
      status: "error",
      message: "Something went wrong!",
    });
  }
};

// Global Error Handler

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(e => e.message);
    err = new AppError(messages.join(". "), 400);
  }

  // Mongoose duplicate key
  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    err = new AppError(`Duplicate value for field "${field}": "${value}"`, 400);
  }

  // Zod validation errors
  if (err.name === "ZodError") {
    const messages = Array.isArray(err.errors)
      ? err.errors.map(e => `${e.path.join(".")}: ${e.message}`)
      : [err.message || "Invalid input"];
    err = new AppError(messages.join(". "), 400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    err = new AppError("Invalid token. Please log in again.", 401);
  }
  if (err.name === "TokenExpiredError") {
    err = new AppError("Token expired. Please refresh or login again.", 401);
  }

  process.env.NODE_ENV === "development"
    ? sendErrorDev(err, res)
    : sendErrorProd(err, res);
};

export default errorHandler;
