import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppError } from "../utils/AppError";

/**
 * Middleware factory to validate that a specific URL parameter is a valid MongoDB ObjectId
 * before any downstream route handler or controller performs a database operation.
 *
 * @param paramName Route parameter name to validate (defaults to 'id')
 */
export const validateObjectId = (paramName: string = "id") => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const id = req.params[paramName];

    if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(
        400,
        "INVALID_ID",
        `Parameter '${paramName}' must be a valid 24-character hexadecimal ObjectId.`
      );
    }

    next();
  };
};
