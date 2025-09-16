import { Request, Response, Express } from "express";
import * as userController from "./../controllers/userController";
export const userRoutes = async (app: Express) => {
  app.get("/users", userController.getUsers);
  app.post("/login", userController.loginUser);
  app.post("/admin/users", userController.addUser);
  app.delete("/admin/users", userController.getUsers);
};
