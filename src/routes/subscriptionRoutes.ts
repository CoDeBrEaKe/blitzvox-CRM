import { Express } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import * as subscriptionsController from "../controllers/subscriptionsController";

export const subscriptionRoutes = async (app: Express) => {
  app.get(
    "/subscriptions",
    authMiddleware,
    subscriptionsController.getSubscriptions
  );
  app.get(
    "/subscriptions/:id",
    authMiddleware,
    subscriptionsController.getSubscriptionById
  );
  app.post(
    "/subscriptions",
    authMiddleware,
    subscriptionsController.createSubscription
  );
  app.put(
    "/subscriptions/:id",
    authMiddleware,
    subscriptionsController.updateSubscription
  );
  app.delete(
    "/subscriptions/:id",
    authMiddleware,
    subscriptionsController.deleteSubscription
  );
};
