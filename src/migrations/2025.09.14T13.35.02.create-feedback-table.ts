import { Sequelize, DataTypes } from "sequelize";
import type { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable("feedbacks", {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    client_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
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
  await sequelize.getQueryInterface().dropTable("feedbacks");
};
