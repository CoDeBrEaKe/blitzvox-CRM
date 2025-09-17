import { Express } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import * as feedbacksController from "../controllers/feedbackController";

export const feedbackRoutes = async (app: Express) => {
  //   app.get("/feedbacks", authMiddleware, feedbacksController.getFeedbacks);
  app.post("/feedbacks", authMiddleware, feedbacksController.createFeedback);
  app.put("/feedbacks/:id", authMiddleware, feedbacksController.updateFeedback);
  app.delete(
    "/feedbacks/:id",
    authMiddleware,
    feedbacksController.deleteFeedback
  );
};
