import { Request, Response, Express } from "express";
import * as userController from "./../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const userRoutes = async (app: Express) => {
  app.get("/users", authMiddleware, userController.getUsers);
  app.get("/users/:id", authMiddleware, userController.getUserById);
  app.delete("/users/:id", authMiddleware, userController.deleteUser);
  app.post("/login", userController.loginUser);
  app.post("/admin/users", authMiddleware, userController.addUser);
  app.get("/logout", authMiddleware, userController.logoutUser);
  app.get("/me", authMiddleware, userController.me);
};
