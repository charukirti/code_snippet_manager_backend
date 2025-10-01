import { config } from "../config/config.js";

export const logger = {
  error: (message: string, error: Error | unknown) => {
    if (config.env === "development") {
      console.error(`${message}:`, error);
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`${message}:`, errorMessage);
    }
  },

  info: (message: string, data?: unknown) => {
    if (data !== undefined) {
      console.info(`${message}:`, data);
    } else {
      console.info(message);
    }
  },

  warn: (message: string, data?: unknown) => {
    if (data !== undefined) {
      console.warn(`${message}:`, data);
    } else {
      console.warn(message);
    }
  },
};
