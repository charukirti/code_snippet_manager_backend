import mongoose, { Schema } from "mongoose";
import type { Snippet } from "../types/index.js";

const snippetSchema = new Schema<Snippet>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
    tag: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    isFavourite: { type: Boolean, index: true },
    favouritedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

snippetSchema.index({ userId: 1, isFavourite: 1 });

export const SnippetModel = mongoose.model<Snippet>("Snippet", snippetSchema);
