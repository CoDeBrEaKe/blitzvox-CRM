import { Sequelize, DataTypes } from "sequelize";
import type { Migration } from "../umzug";
export enum SUB {
  electricity = "electricity",
  gas = "gas",
  internet = "internet",
  health_insurance = "health insurance",
}
export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable("subscriptions", {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    sub_type: {
      type: DataTypes.ENUM(...Object.values(SUB)),
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });
};
export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable("subscriptions");
};
