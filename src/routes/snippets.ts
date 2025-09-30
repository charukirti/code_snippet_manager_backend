import { Router } from "express";
import { checkAuth, protectRoute } from "../middlewares/auth.js";
import {
  createSnippet,
  deleteSnippet,
  getAllSnippets,
  getSnippetById,
  updateSnippet,
} from "../controllers/snippet.controller.js";

const router = Router();

router.use(protectRoute);
router.use(checkAuth);

router.get("/", getAllSnippets);
router.post("/", createSnippet);
router.patch("/:id", updateSnippet);
router.get("/:id", getSnippetById);
router.delete("/:id", deleteSnippet);

export default router;
