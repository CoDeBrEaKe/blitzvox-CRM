import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import { createRoutes } from "./routes";
import config from "./config";

export const createServer = () => {
  const app = express();
  const allowedOrigins = "https://blitzvox.netlify.app";
  console.log(allowedOrigins);
  app.disable("x-powered-by").use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser()).use(
    cors({
      origin: [allowedOrigins, "http://127.0.0.1:8002"],
      credentials: true, // ✅ this is critical for cookies
    })
  );

  createRoutes(app);

  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Welcome to the API" });
  });

  return app;
};
