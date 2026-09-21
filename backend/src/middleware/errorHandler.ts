import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    },
  });
};

export const errorHandler = (
  err: Error | AppError | any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // 1. Handled operational AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
    return;
  }

  // 2. Mongoose Invalid ObjectId CastError
  if (err.name === "CastError" && err.kind === "ObjectId") {
    res.status(400).json({
      success: false,
      error: {
        code: "INVALID_ID",
        message: `Invalid identifier format for parameter: ${err.path}`,
      },
    });
    return;
  }

  // 3. Mongoose Schema Validation Error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors || {}).map(
      (e: any) => e.message || "Invalid value"
    );
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: messages.join(", ") || "Validation failed",
        details: err.errors,
      },
    });
    return;
  }

  // 4. MongoDB Duplicate Key (E11000)
  if (err.code === 11000) {
    res.status(409).json({
      success: false,
      error: {
        code: "DUPLICATE_RESOURCE",
        message: "A resource with this key already exists",
      },
    });
    return;
  }

  // 5. Unhandled / Server Errors
  console.error("💥 Unhandled Server Exception:", err);

  const isProduction = process.env.NODE_ENV === "production";
  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: isProduction
        ? "An internal server error occurred"
        : err.message || "An unexpected error occurred",
      ...(!isProduction && err.stack ? { stack: err.stack } : {}),
    },
  });
};
