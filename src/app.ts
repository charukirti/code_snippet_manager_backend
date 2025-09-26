import express from 'express'
import globalErrorHandler from "./middlewares/globalErrorHandler.js";

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get("/health", (req, res) => {
  res.json({ message: "Welcome to the api" });
});


// global error handler middleware

app.use(globalErrorHandler)

export default app;
