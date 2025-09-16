import { Express, Request, Response } from "express";
import * as clientsController from "../controllers/clientsController";
export const createClientRoutes = async (app: Express) => {
  app.get("/clients/:id", clientsController.getClientById);
};
