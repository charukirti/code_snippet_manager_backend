import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../types/index.js";
import { SnippetModel } from "../models/snippet.model.js";

// get all snippet
export async function getAllSnippets(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {

    // TODO : Add pagination

    // get userId from req

    const { userId } = getAuth(req);

     // Add this debug line:
    console.log('UserId from getAuth:', userId);

    if (!userId) {
      throw new AppError("Not authenticated", 401);
    }

    // if user is there query db and send res

    const snippets = await SnippetModel.find({ userId });

    res.json({
      message: "Success",
      data: snippets,
    });
  } catch (error) {
    next(error);
  }
}

// get single snippet

export async function getSnippetById(
  req: Request,
  res: Response,
  next: NextFunction
) {}

// create new snippet

export async function createSnippet(
  req: Request,
  res: Response,
  next: NextFunction
) {}

// edit snippet

export async function updateSnippet(
  req: Request,
  res: Response,
  next: NextFunction
) {}

// delete snippet

export async function deleteSnippet(
  req: Request,
  res: Response,
  next: NextFunction
) {}
