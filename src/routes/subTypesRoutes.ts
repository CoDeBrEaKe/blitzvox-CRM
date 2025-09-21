import { Request, Response, Express } from "express";
import * as subTypesController from "../controllers/subTypesController";

export const createSubTypesRoutes = async (app: Express) => {
  app.get("/subscription-types", subTypesController.getSubTypes);
  app.post("/subscription-types", subTypesController.createSubTypes);
};
