// Language types
export type Language =
  | "javascript"
  | "typescript"
  | "jsx"
  | "tsx"
  | "python"
  | "java"
  | "cpp"
  | "css"
  | "html"
  | "json"
  | "markdown"
  | "sql"
  | "bash"
  | "yaml"
  | "other";

// snippet

export interface Snippet {
  id?: string;
  title: string;
  description: string;
  language: Language;
  tags: string[];
  code: string;
  userId: string;
}

// Create / Update snippet

export interface SnippetFormData {
  title: string;
  code: string;
  language: Language;
  tag: string;
  description?: string;
  userId?: string;
}

// Query interface for filtering
export interface SnippetQuery {
  search?: string;
  language?: Language;
  tag?: string;
  page?: number;
  limit?: number;
}
