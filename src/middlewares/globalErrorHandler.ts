// global error handler middleware

import type { NextFunction, Request, Response } from "express";
import type { AppError } from "../types/index.js";
import { config } from "../config/config.js";

const globalErrorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    message: err.message,
    errorStack: config.env === 'development' ? err.stack : '',
  })
}

export default globalErrorHandler