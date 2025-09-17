import { Express, Request, Response } from "express";
import * as clientsController from "../controllers/clientsController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const clientRoutes = async (app: Express) => {
  app.get("/clients/:id", authMiddleware, clientsController.getClientById);
  app.get("/clients", authMiddleware, clientsController.getClients);
  app.post("/clients", authMiddleware, clientsController.createClient);
  app.put("/clients/:id", authMiddleware, clientsController.updateClient);
  app.delete("/clients/:id", authMiddleware, clientsController.deleteClient);
};
