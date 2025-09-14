import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";

export const createServer = () => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(express.urlencoded())
    .use(express.json())
    .use(cors());

  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
      message: "Welcome to the API",
    });
  });

  return app;
};
