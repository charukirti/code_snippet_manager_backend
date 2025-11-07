import { z } from "zod";

const languageValues = [
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "python",
  "java",
  "cpp",
  "css",
  "html",
  "json",
  "markdown",
  "sql",
  "bash",
  "yaml",
  "other",
] as const;

export const createSnippetSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description too long"),
  code: z.string().min(1, "Code is required"),
  language: z.enum(languageValues, { message: "Invalid language" }),
  tag: z.string().min(1, "Tag is required").max(50, "Tag too long"),
});

export const updateSnippetSchema = createSnippetSchema.partial();

export const snippetQuerySchema = z.object({
  language: z.enum(languageValues).optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
});
