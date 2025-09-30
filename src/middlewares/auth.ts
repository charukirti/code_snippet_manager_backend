import { getAuth, requireAuth } from "@clerk/express";
import { AppError } from "../types/index.js";
import type { Request, Response, NextFunction } from "express";

export const protectRoute = requireAuth();

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = getAuth(req);

  if (!userId) {
    throw new AppError("Not authenticated", 401);
  }

  req.userId = userId;

  next();
};
