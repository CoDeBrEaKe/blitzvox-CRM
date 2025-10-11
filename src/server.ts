import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import { createRoutes } from "./routes";
import config from "./config";

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
        origin: ["https://blitzvox.netlify.app"], // Only allow your frontend
        methods: ["GET", "POST", "OPTIONS"], // Explicitly allow methods
        allowedHeaders: ["Content-Type", "Authorization"], // Allow common headers
        credentials: true, // Allow cookies/credentials
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
