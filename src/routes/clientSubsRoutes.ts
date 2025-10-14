import { Request, Express, Response } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import * as clientSubController from "../controllers/clientSubscriptionsController";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
export const createClientSubRoutes = async (app: Express) => {
  app.post(
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
    "/client-subscription/create",
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
  app.post(
    "/api/documents/upload",
    authMiddleware,
    upload.single("file"),
    clientSubController.uploadFile
  );
};
