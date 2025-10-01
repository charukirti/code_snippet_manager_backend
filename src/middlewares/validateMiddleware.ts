import type { Request, Response, NextFunction } from "express";
import z from "zod";
import { AppError } from "../types/index.js";

export const validate = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.issues
          .map((issue) => {
            const field = issue.path.join(".");

            if (issue.code === "invalid_type") {
              return `${
                field.charAt(0).toUpperCase() + field.slice(1)
              } is required`;
            }

            return issue.message;
          })
          .join(", ");

        return next(new AppError(messages, 400));
      }

      next(error);
    }
  };
};
