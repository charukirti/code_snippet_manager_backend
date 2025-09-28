import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";
import {
  AppError,
  type Snippet,
  type SnippetFormData,
} from "../types/index.js";
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

    if (!userId) {
      throw new AppError("Not authenticated", 401);
    }

    // if user is there query db and send res

    const snippets = await SnippetModel.find({ userId });

    console.log("Snippets", snippets);
    res.json({
      message: "Success",
      data: snippets,
    });
  } catch (error) {
    console.error("Database error:", error);
    return next(new AppError("Error while fetching snippets", 500));
  }
}

// get single snippet

export async function getSnippetById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;

    const { userId } = getAuth(req);

    const snippet = await SnippetModel.findOne({ _id: id, userId: userId });

    if (!snippet) {
      return next(new AppError("Snippet not found", 404));
    }

    console.log("Single snippet", snippet);

    res.status(200).json({ success: true, data: snippet });
  } catch (error) {
    console.log("Unable to get snippet", error);

    return next(new AppError("Unable to fetch snippet", 500));
  }
}

// create new snippet

export async function createSnippet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const snippetData: SnippetFormData = req.body;

    const { userId } = getAuth(req);

    if (!userId) {
      throw new AppError("Not authenticated", 401);
    }

    const newSnippet: Snippet = {
      title: snippetData.title,
      description: snippetData.description,
      language: snippetData.language,
      tags: snippetData.tag,
      code: snippetData.code,
      userId: userId!,
    };

    await SnippetModel.create(newSnippet);

    return res.status(201).json({ success: true, title: newSnippet.title });
  } catch (error) {
    console.error("Create snippet error:", error);
    return next(new AppError("Error while adding new snippet", 500));
  }
}

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
