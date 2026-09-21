import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { User, IUserDocument } from "../models";
import { AppError } from "../utils/AppError";

// Extend Express Request interface to include resolved user document
declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}

/**
 * Resolves a user from request headers:
 * 1. Checks 'x-auth-token' against User.mockAuthToken
 * 2. Checks 'x-user-id' against User._id (if valid ObjectId) or User.mockAuthToken
 */
const resolveUserFromHeaders = async (req: Request): Promise<IUserDocument | null> => {
  const authToken = (req.headers["x-auth-token"] as string | undefined)?.trim();
  const userId = (req.headers["x-user-id"] as string | undefined)?.trim();

  if (authToken) {
    const user = await User.findOne({ mockAuthToken: authToken });
    if (user) return user;
  }

  if (userId) {
    if (mongoose.Types.ObjectId.isValid(userId)) {
      const user = await User.findById(userId);
      if (user) return user;
    }
    // Fallback: check if userId header holds the mockAuthToken string
    const user = await User.findOne({ mockAuthToken: userId });
    if (user) return user;
  }

  return null;
};

/**
 * Enforces mandatory authentication.
 * Returns 401 Unauthorized if auth header is missing or does not resolve to an active User.
 */
export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await resolveUserFromHeaders(req);

    if (!user) {
      throw new AppError(
        401,
        "UNAUTHORIZED",
        "Authentication required. Please provide a valid 'x-auth-token' or 'x-user-id' header."
      );
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication for read-only routes (e.g. GET /competitions/:id).
 * Populates req.user if valid credentials are provided; allows anonymous access otherwise.
 */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await resolveUserFromHeaders(req);
    if (user) {
      req.user = user;
    }
    next();
  } catch (error) {
    next(error);
  }
};
