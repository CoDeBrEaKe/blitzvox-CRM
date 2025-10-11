import { Sequelize, DataTypes } from "sequelize";
import type { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable("subscription_types", {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    sub_type: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    sub_image: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
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
  await sequelize.getQueryInterface().dropTable("subscription_types");
};
