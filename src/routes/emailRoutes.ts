import { Express, Request, Response } from "express";
import * as emailsController from "../controllers/emailsController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const emailRoutes = async (app: Express) => {
  app.get("/emails/:id", authMiddleware, emailsController.getEmailById);
  app.get("/emails", authMiddleware, emailsController.getEmails);
  app.post("/emails", authMiddleware, emailsController.createEmail);
  app.put("/emails/:id", authMiddleware, emailsController.updateEmail);
  app.delete("/emails/:id", authMiddleware, emailsController.deleteEmail);
  app.post("/send-email", authMiddleware, emailsController.sendEmail);
};
