import express from 'express'
import cors from 'cors'
import {clerkMiddleware} from '@clerk/express'
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import router from './routes/snippets.js';
import { config } from './config/config.js';

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(clerkMiddleware())
app.use(cors({
  origin: config.client_url,
  credentials: true
}))

app.get("/health", (req, res) => {
  res.json({ message: "Welcome to the api" });
});
app.get('/', (req, res) => {
  res.json({ 
    message: 'Code Snippets API is running!',
    version: '1.0.0',
  });
});

app.use('/api/snippets', router)


app.use(globalErrorHandler)

export default app;
