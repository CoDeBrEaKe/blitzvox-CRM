// export default const createRoutes = () => {};
import { Express } from "express";
import { userRoutes } from "./userRoutes";
import { feedbackRoutes } from "./feedbackRoutes";
import { emailRoutes } from "./emailRoutes";
import { clientRoutes } from "./clientRoutes";
import { subscriptionRoutes } from "./subscriptionRoutes";
import { createSubTypesRoutes } from "./subTypesRoutes";

export const createRoutes = async (app: Express) => {
  // Define routes here and import route files
  userRoutes(app);
  feedbackRoutes(app);
  emailRoutes(app);
  subscriptionRoutes(app);
  clientRoutes(app);
  createSubTypesRoutes(app);
};
