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

export async function toggleFavorite(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    const userId = req.userId;

    if (!isValidObjectId(id)) {
      return next(new AppError("Invalid object id format", 400));
    }

    if (!userId) {
      return next(new AppError("Not authenticated", 401));
    }

    const snippet = await SnippetModel.findOne({ _id: id, userId });

    if (!snippet) {
      return next(new AppError("Snippet not found", 404));
    }

    snippet.isFavourite = !snippet.isFavourite;
    snippet.favouritedAt = snippet.isFavourite ? new Date() : null;

    snippet.save();

    return res.status(200).json({
      success: true,
      message: `Snippet ${
        snippet.isFavourite ? "added to" : "removed from"
      } favourites`,
      data: snippet,
    });
  } catch (error) {
    logger.error("Error in favouriteSnippet", error);
    return next(new AppError("Unable to favourite snippet", 500));
  }
}

export async function getFavourites(
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
      return next(new AppError("Invalid query params", 400));
    }

    const filter: FilterQuery<Snippet> = { userId, isFavourite: true };
    const sort: Record<string, 1 | -1> = {};

    if (queryResult.data.sortBy) {
      sort[queryResult.data.sortBy] =
        queryResult.data.order === "desc" ? -1 : 1;
    } else {
      sort.favouritedAt = -1;
    }

    if (queryResult.data.tag) {
      filter.tag = queryResult.data.tag;
    }

    if (queryResult.data.language) {
      filter.language = queryResult.data.language;
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

    const favourites = await SnippetModel.find(filter)
      .sort(sort)
      .lean()
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Favourite snippets retrieved successfully",
      data: favourites,
      pagination: {
        total: total,
        count: favourites.length,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrevious: page > 1,
      },
    });
  } catch (error) {
    logger.error("Error in getFavourites", error);
    return next(new AppError("Unable to get favourite snippets", 500));
  }
}

export async function exportSnippets(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId;
    if (!userId) {
      return new AppError("Not authenticated", 401);
    }

    const format = req.query.format as string;

    if (format !== "json") {
      return new AppError("Currently json format export is supported", 400);
    }

    const { snippetIds } = req.body;

    if (!snippetIds || !Array.isArray(snippetIds)) {
      return new AppError("Snippet ids must be in a array format", 400);
    }

    if (snippetIds.length === 0) {
      return new AppError("No snippets selected for export", 404);
    }

    const invalidIds = snippetIds.filter((id) => !isValidObjectId(id));

    if (invalidIds.length > 0) {
      return next(
        new AppError(`Invalid snippet IDs: ${invalidIds.join(",")}`, 400)
      );
    }

    const snippets = await SnippetModel.find({
      _id: { $in: snippetIds },
      userId: userId,
    });

    if (snippets.length === 0) {
      return new AppError("There are no snippets to export", 404);
    }

    const exportData = {
      exportedAt: new Date().toISOString(),
      totolSnippets: snippets.length,
      format: "json",
      snippets: snippets.map((snippet) => ({
        id: snippet._id,
        title: snippet.title,
        description: snippet.description,
        code: snippet.code,
        language: snippet.language,
        tag: snippet.tag,
        isFavourite: snippet.isFavourite,
      })),
    };

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `snippet-export-${timestamp}.json`;

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

    return res.status(200).send(JSON.stringify(exportData, null, 2));
  } catch (error) {
    logger.error("Error exporting snippets", error);
    return next(new AppError("Unable to export snippets", 500));
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
