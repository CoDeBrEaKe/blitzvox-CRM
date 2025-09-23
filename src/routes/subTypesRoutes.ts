import { Request, Response, Express } from "express";
import * as subTypesController from "../controllers/subTypesController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const createSubTypesRoutes = async (app: Express) => {
  app.get(
    "/subscription-types",
    authMiddleware,
    subTypesController.getSubTypes
  );
  app.post(
    "/subscription-types",
    authMiddleware,
    subTypesController.createSubTypes
  );
  app.get(
    "/subscription-types/:id",
    authMiddleware,
    subTypesController.getSubTypeById
  );
  app.delete(
    "/subscription-types/:id",
    authMiddleware,
    subTypesController.deleteSubType
  );
  app.put(
    "/subscription-types/:id",
    authMiddleware,
    subTypesController.updateSubTypes
  );
};
