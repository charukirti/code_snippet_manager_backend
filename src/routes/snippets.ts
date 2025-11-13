import { Router } from "express";
import { checkAuth, protectRoute } from "../middlewares/auth.js";
import {
  createSnippet,
  deleteSnippet,
  getAllSnippets,
  getFavourites,
  getSnippetById,
  toggleFavorite,
  updateSnippet,
} from "../controllers/snippet.controller.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  createSnippetSchema,
  updateSnippetSchema,
} from "../schemas/snippetSchema.js";

const router = Router();

router.use(protectRoute);
router.use(checkAuth);

router.get("/", getAllSnippets);
router.post("/", validate(createSnippetSchema), createSnippet);
router.get("/favourites", getFavourites);
router.patch("/:id", validate(updateSnippetSchema), updateSnippet);
router.patch("/:id/favourite", toggleFavorite);
router.get("/:id", getSnippetById);
router.delete("/:id", deleteSnippet);

export default router;
