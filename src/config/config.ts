import { config as conf } from "dotenv";
conf()

const _config = {
    port: process.env.PORT,
    databaseUrl: process.env.MONGO_CONNECTION_STRING,
    env: process.env.NODE_ENV,
    clerk_publish: process.env.CLERK_PUBLISHABLE_KEY,
    clerk_secret: process.env.CLERK_SECRET_KEY
}

export const config = Object.freeze(_config)