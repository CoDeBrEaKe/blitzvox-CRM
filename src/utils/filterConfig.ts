import { Op } from "sequelize";
export interface FilterConfigItem {
  field: string;
  operator: symbol;
  model: string;
}
export const filterConfig: { [key: string]: FilterConfigItem[] } = {
  "subscription.sub_name": [
    {
      field: "sub_name",
      operator: Op.iLike,
      model: "Subscription",
    },
  ],
  "client.first_name": [
    {
      field: "first_name",
      operator: Op.iLike,
      model: "Client",
    },
    {
      field: "family_name",
      operator: Op.iLike,
      model: "Client",
    },
  ],
};
