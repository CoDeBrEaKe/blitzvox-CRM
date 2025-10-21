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
    sub_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "subscription_types",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    sub_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
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
  await sequelize.getQueryInterface().addConstraint("subscriptions", {
    fields: ["sub_id"],
    type: "foreign key",
    name: "subscription_types_pkey",
    references: {
      table: "subscription_types",
      field: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  });
};
export const down: Migration = async ({ context: sequelize }) => {
  await sequelize
    .getQueryInterface()
    .removeConstraint("subscriptions", "subscription_types_pkey");
  await sequelize.getQueryInterface().dropTable("subscriptions");
};
