import { Express } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import * as reportsController from "../controllers/reportsController";
export const reportsRoutes = (app: Express) => {
  app.get("/reports", authMiddleware, reportsController.getReports);
};
