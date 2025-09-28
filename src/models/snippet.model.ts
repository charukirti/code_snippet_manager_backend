import mongoose, { Schema } from "mongoose";
import type { Snippet } from "../types/index.js";

const snippetSchema = new Schema<Snippet>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
    tags: { type: String, required: true },
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const SnippetModel = mongoose.model<Snippet>("Snippet", snippetSchema);
