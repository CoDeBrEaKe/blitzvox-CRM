import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import { createClientRoutes } from "./routes/clientRoutes";

export const createServer = () => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(express.urlencoded())
    .use(express.json())
    .use(cors());
  createClientRoutes(app);
  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
      message: "Welcome to the API",
    });
  });

  return app;
};
