import { Sequelize, DataTypes } from "sequelize";
import type { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  const queryInterface = sequelize.getQueryInterface();

  await queryInterface.createTable("client_sub", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
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
      defaultValue: 0,
    },
    night_consumption: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0,
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
      type: DataTypes.ENUM("1 Year", "2 Years"),
      allowNull: true,
    },
    family_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
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
    },
    sub_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
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

  // ✅ Foreign key constraints added explicitly
  await queryInterface.addConstraint("client_sub", {
    fields: ["user_id"],
    type: "foreign key",
    name: "fk_client_sub_user",
    references: {
      table: "users",
      field: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  });

  await queryInterface.addConstraint("client_sub", {
    fields: ["client_id"],
    type: "foreign key",
    name: "fk_client_sub_client",
    references: {
      table: "clients",
      field: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  });

  await queryInterface.addConstraint("client_sub", {
    fields: ["sub_id"],
    type: "foreign key",
    name: "fk_client_sub_subscription",
    references: {
      table: "subscriptions",
      field: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  });

  // Unique constraint
  await queryInterface.addConstraint("client_sub", {
    fields: ["client_id", "sub_id"],
    type: "unique",
    name: "unique_client_sub",
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  const queryInterface = sequelize.getQueryInterface();

  // Remove constraints (in reverse order)
  await queryInterface.removeConstraint("client_sub", "unique_client_sub");
  await queryInterface.removeConstraint(
    "client_sub",
    "fk_client_sub_subscription"
  );
  await queryInterface.removeConstraint("client_sub", "fk_client_sub_client");
  await queryInterface.removeConstraint("client_sub", "fk_client_sub_user");

  // Drop table
  await queryInterface.dropTable("client_sub");
};
