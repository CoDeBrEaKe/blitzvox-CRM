import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import { createRoutes } from "./routes";

export const createServer = () => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(express.urlencoded())
    .use(express.json())
    .use(cookieParser())
    .use(
      cors({
        origin: "http://127.0.0.1:8002", // Frontend URL
        credentials: true,
      })
    );
  createRoutes(app);
  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
      message: "Welcome to the API",
    });
  });

  return app;
};
