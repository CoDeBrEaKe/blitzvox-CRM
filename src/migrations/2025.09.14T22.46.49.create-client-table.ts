import { Sequelize, DataTypes } from "sequelize";
import type { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable("client_sub", {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    order_num: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    your_order_num: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cost: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    counter_number: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    consumption: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    night_consumption: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    paid: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    paid_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    rl: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    rl_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    termination_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    restablish_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sign_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    start_importing: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_importing: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    contract_end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    contract_time: {
      type: DataTypes.ENUM("1 Year", "2 Year"),
      allowNull: true,
    },
    family_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    persons_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    persons_name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    documents_link: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    client_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "clients",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    sub_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "subscriptions",
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
  await sequelize.getQueryInterface().dropTable("client_sub");
};
