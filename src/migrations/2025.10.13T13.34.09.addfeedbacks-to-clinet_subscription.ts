import { Sequelize, DataTypes } from "sequelize";
import type { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().addColumn("feedbacks", "client_sub_id", {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: "client_sub",
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};
export const down: Migration = async ({ context: sequelize }) => {
  await sequelize
    .getQueryInterface()
    .removeColumn("feedbacks", "client_sub_id");
};
