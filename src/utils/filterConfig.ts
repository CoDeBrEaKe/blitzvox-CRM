import { Op } from "sequelize";
export interface FilterConfigItem {
  field: string;
  operator: symbol;
  model: string;
  isDate?: boolean;
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
  sign_date: [
    {
      field: "sign_date",
      operator: Op.between,
      model: "Client_Sub",
      isDate: true, // ← New flag for special handling
    },
  ],
  start_importing: [
    {
      field: "start_importing",
      operator: Op.between,
      model: "Client_Sub",
      isDate: true,
    },
  ],
  end_importing: [
    {
      field: "end_importing",
      operator: Op.between,
      model: "Client_Sub",
      isDate: true,
    },
  ],
  your_order_num: [
    {
      field: "your_order_num",
      operator: Op.iLike,
      model: "Client_Sub",
    },
  ],
};
