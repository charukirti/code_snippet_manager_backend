import express from 'express'
import globalErrorHandler from "./middlewares/globalErrorHandler.js";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the api" });
});


// global error handler middleware

app.use(globalErrorHandler)

export default app;
