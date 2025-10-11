import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import { createRoutes } from "./routes";
import config from "./config";

export const createServer = () => {
  const app = express();
  const allowedOrigins = "https://blitzvox.netlify.app";

  console.log("CORS Allowed Origins:", allowedOrigins);

  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(cookieParser())
    .use(
      cors({
        origin: allowedOrigins,
        credentials: true,
      })
    );

  createRoutes(app);
  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Welcome to the API" });
  });

  return app;
};
