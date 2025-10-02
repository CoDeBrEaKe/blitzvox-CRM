import { Request, Express, Response } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import * as clientSubController from "../controllers/clientSubscriptionsController";
export const createClientSubRoutes = async (app: Express) => {
  app.get(
    "/client-subscription",
    authMiddleware,
    clientSubController.getClientSubscribtions
  );
  app.get(
    "/client-subscription/:id",
    authMiddleware,
    clientSubController.getSingleClientSubscribtion
  );
  app.post(
    "/client-subscription",
    authMiddleware,
    clientSubController.createClientSub
  );
  app.put(
    "/client-subscription/:id",
    authMiddleware,
    clientSubController.updateClientSub
  );
  app.delete(
    "/client-subscription/:id",
    authMiddleware,
    clientSubController.deleteClientSub
  );
};
