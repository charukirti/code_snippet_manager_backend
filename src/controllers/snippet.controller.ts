import type { NextFunction, Request, Response } from "express";
import {
  AppError,
  type Snippet,
  type SnippetFormData,
} from "../types/index.js";
import { SnippetModel } from "../models/snippet.model.js";
import { isValidObjectId, type FilterQuery } from "mongoose";
import { logger } from "../utils/logger.js";
import { snippetQuerySchema } from "../schemas/snippetSchema.js";

export async function getAllSnippets(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId;

    if (!userId) {
      return next(new AppError("Not authenticated", 401));
    }

    const queryResult = snippetQuerySchema.safeParse(req.query);

    if (!queryResult.success) {
      return next(new AppError("Invalid query parameters", 400));
    }

    const filter: FilterQuery<Snippet> = { userId };
    const sort: Record<string, 1 | -1> = {};

    if (queryResult.data.sortBy) {
      sort[queryResult.data.sortBy] =
        queryResult.data.order === "desc" ? -1 : 1;
    }

    if (queryResult.data.language) {
      filter.language = queryResult.data.language;
    }

    if (queryResult.data.tag) {
      filter.tag = queryResult.data.tag;
    }

    if (queryResult.data.search) {
      filter.$or = [
        { title: { $regex: queryResult.data.search, $options: "i" } },
        { description: { $regex: queryResult.data.search, $options: "i" } },
        { code: { $regex: queryResult.data.search, $options: "i" } },
      ];
    }

    const page: number = Math.max(Number(req.query.page) || 1, 1);
    const limit: number = Math.min(Number(req.query.limit) || 4, 100);

    const skip = (page - 1) * limit;

    const total = await SnippetModel.countDocuments(filter);

    const snippets = await SnippetModel.find(filter)
      .sort(sort)
      .lean()
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Snippets retrieved successfully",
      data: snippets,
      pagination: {
        total: total,
        count: snippets.length,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrevious: page > 1,
      },
    });
  } catch (error) {
    logger.error("Error in getAllSnippets", error);
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
    logger.error("Error in getSnippetById", error);
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
      return next(new AppError("Not authenticated", 401));
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
    logger.error("Error in createSnippet", error);
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
    logger.error("Error in updateSnippet", error);
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
    logger.error("Error in deleteSnippet", error);
    return next(new AppError("Unable to delete snippet", 500));
  }
}
