import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types";
import { sendError } from "../utils/apiResponse";

interface AdminPayload {
  isAdmin: boolean;
  email: string;
}

export const adminAuthenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      sendError(res, "Access denied. No token provided.", 401);
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      sendError(res, "Access denied. No token provided.", 401);
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret",
    ) as AdminPayload;

    if (!decoded.isAdmin) {
      sendError(res, "Admin access required.", 403);
      return;
    }

    req.user = { userId: 0, email: decoded.email };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      sendError(res, "Token expired.", 401);
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      sendError(res, "Invalid token.", 401);
      return;
    }
    sendError(res, "Authentication failed.", 401);
  }
};
