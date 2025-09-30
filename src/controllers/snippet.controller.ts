import type { NextFunction, Request, Response } from "express";
import {
  AppError,
  type Snippet,
  type SnippetFormData,
} from "../types/index.js";
import { SnippetModel } from "../models/snippet.model.js";
import { isValidObjectId } from "mongoose";

export async function getAllSnippets(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId;

    if (!userId) {
      throw new AppError("Not authenticated", 401);
    }

    const snippets = await SnippetModel.find({ userId }).lean();

    return res.status(200).json({
      success: true,
      message: "Snippets retrieved successfully",
      data: snippets,
    });
  } catch (error) {
    return next(new AppError("Error while fetching snippets", 500));
  }
}

export async function getSnippetById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      return next(new AppError("Invalid snippet object id format", 400));
    }

    const userId = req.userId;

    const snippet = await SnippetModel.findOne({ _id: id, userId }).lean();

    if (!snippet) {
      return next(new AppError("Snippet not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Snippet retrieved successfully",
      data: snippet,
    });
  } catch (error) {
    return next(new AppError("Unable to retrieve snippet", 500));
  }
}

export async function createSnippet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const snippetData: SnippetFormData = req.body;

   const userId = req.userId;

    if (!userId) {
      throw new AppError("Not authenticated", 401);
    }

    const newSnippet: Snippet = {
      title: snippetData.title,
      description: snippetData.description,
      language: snippetData.language,
      tag: snippetData.tag,
      code: snippetData.code,
      userId: userId,
    };

    await SnippetModel.create(newSnippet);

    return res.status(201).json({
      success: true,
      message: "New snippet created successfully",
      data: newSnippet,
    });
  } catch (error) {
    return next(new AppError("Error while adding new snippet", 500));
  }
}

export async function updateSnippet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(new AppError("Data to update cannot be empty", 400));
    }

    const id = req.params.id;

    if (!isValidObjectId(id)) {
      return next(new AppError("Invalid object id format", 400));
    }

    const userId = req.userId;

    if (!userId) {
      return next(new AppError("Not authenticated", 401));
    }

    const updatedSnippet = await SnippetModel.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedSnippet) {
      return next(new AppError("Snippet not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Snippet updated successfully",
      data: updatedSnippet,
    });
  } catch (error) {
    return next(new AppError("Unable to update snippet", 500));
  }
}

export async function deleteSnippet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      return next(new AppError("Invalid object id format", 400));
    }

   const userId = req.userId;

    if (!userId) {
      return next(new AppError("Not authenticated", 401));
    }

    const deletedSnippet = await SnippetModel.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedSnippet) {
      return next(new AppError("Snippet not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Snippet deleted successfully",
      data: deletedSnippet,
    });
  } catch (error) {
    return next(new AppError("Unable to delete snippet", 500));
  }
}
