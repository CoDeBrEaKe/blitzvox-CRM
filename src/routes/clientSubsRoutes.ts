import { Request, Express, Response } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import * as clientSubController from "../controllers/clientSubscriptionsController";
export const createClientSubRoutes = async (app: Express) => {
  app.get(
    "/client-subscribtion",
    authMiddleware,
    clientSubController.getClientSubscribtions
  );
  app.get(
    "/client-subscribtion/:id",
    authMiddleware,
    clientSubController.getSingleClientSubscribtion
  );
  app.post(
    "/client-subscribtion",
    authMiddleware,
    clientSubController.createClientSub
  );
  app.put(
    "/client-subscribtion/:id",
    authMiddleware,
    clientSubController.updateClientSub
  );
  app.delete(
    "/client-subscribtion/:id",
    authMiddleware,
    clientSubController.deleteClientSub
  );
};
