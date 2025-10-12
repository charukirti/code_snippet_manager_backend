import { config as conf } from "dotenv";
import z from "zod";
conf();

const envSchema = z.object({
  PORT: z.string().transform(Number).default(3001),
  MONGO_CONNECTION_STRING: z
    .string()
    .min(1, "Mongo connection string is required"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  CLERK_PUBLISHABLE_KEY: z.string().min(1, "Clerk publishable key is required"),
  CLERK_SECRET_KEY: z.string().min(1, "Clerk secret key is required"),
  CLIENT_URL: z.string().default("http://localhost:3000"),
});

const validateEnv = () => {
  try {
    const parsed = envSchema.parse(process.env);
    return parsed;
  } catch (error) {
    console.error("Invalid environment variables");
    console.error(error);
    process.exit(1);
  }
};

const env = validateEnv();

const _config = {
  port: env.PORT,
  databaseUrl: env.MONGO_CONNECTION_STRING,
  env: env.NODE_ENV,
  clerk_publish: env.CLERK_PUBLISHABLE_KEY,
  clerk_secret: env.CLERK_SECRET_KEY,
  client_url:
    env.NODE_ENV === "development" ? "https://code-snippet-manager-eight.vercel.app" : "http://localhost:3000",
};

export const config = Object.freeze(_config);
