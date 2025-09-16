// export default const createRoutes = () => {};
import { Express } from "express";
import { userRoutes } from "./userRoutes";

export const createRoutes = async (app: Express) => {
  // Define routes here and import route files
  userRoutes(app);
};
