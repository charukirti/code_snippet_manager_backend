import { Router } from "express";
import { protectRoute } from "../middlewares/auth.js";
import {
  createSnippet,
  deleteSnippet,
  getAllSnippets,
  getSnippetById,
  updateSnippet,
} from "../controllers/snippet.controller.js";

const router = Router();

router.use(protectRoute);

router.get("/", getAllSnippets);
router.post("/", createSnippet);
router.post("/:id", updateSnippet);
router.get("/:id", getSnippetById);
router.delete("/:id", deleteSnippet);


export default router
