// export default const createRoutes = () => {};
import { Express } from "express";
import { userRoutes } from "./userRoutes";
import { feedbackRoutes } from "./feedbackRoutes";
import { emailRoutes } from "./emailRoutes";
import { clientRoutes } from "./clientRoutes";
import { subscriptionRoutes } from "./subscriptionRoutes";
import { createSubTypesRoutes } from "./subTypesRoutes";
import { createClientSubRoutes } from "./clientSubsRoutes";
import { reportsRoutes } from "./reportsRoutes";
export const createRoutes = async (app: Express) => {
  // Define routes here and import route files
  userRoutes(app);
  feedbackRoutes(app);
  emailRoutes(app);
  subscriptionRoutes(app);
  clientRoutes(app);
  createSubTypesRoutes(app);
  createClientSubRoutes(app);
  reportsRoutes(app);
};
