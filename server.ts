import app from "./src/app.js";
import { config } from "./src/config/config.js";
import connectDB from "./src/config/database.js";
import { logger } from "./src/utils/logger.js";

const startServer = async () => {
  await connectDB();

  const port = config.port || 3001;

  app.listen(port, () => {
    logger.info(`server is running at PORT: ${port}`);
  });
};

startServer();
