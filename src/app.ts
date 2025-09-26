import express from 'express'
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import {clerkMiddleware} from '@clerk/express'

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(clerkMiddleware())

app.get("/health", (req, res) => {
  res.json({ message: "Welcome to the api" });
});
app.get('/', (req, res) => {
  res.json({ 
    message: 'Code Snippets API is running!',
    version: '1.0.0',
  });
});


// global error handler middleware

app.use(globalErrorHandler)

export default app;
