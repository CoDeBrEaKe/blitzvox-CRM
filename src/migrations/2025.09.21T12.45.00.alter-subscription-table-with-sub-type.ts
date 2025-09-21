import { DataTypes } from "sequelize";
import type { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  const queryInterface = sequelize.getQueryInterface();

  // 1. Rename column
  await queryInterface.sequelize.query(`
    ALTER TABLE subscriptions
    RENAME COLUMN sub_type TO sub_id;
  `);

  // 2. Change column type
  await queryInterface.sequelize.query(`
    ALTER TABLE subscriptions
    ALTER COLUMN sub_id
    TYPE BIGINT
    USING sub_id::BIGINT;
  `);

  // 3. Add foreign key
  await queryInterface.sequelize.query(`
    ALTER TABLE subscriptions
    ADD CONSTRAINT fk_subscriptions_sub_id
    FOREIGN KEY (sub_id) REFERENCES subscription_types(id);
  `);
};

export const down: Migration = async ({ context: sequelize }) => {
  const queryInterface = sequelize.getQueryInterface();

  // 1. Drop foreign key constraint
  await queryInterface.sequelize.query(`
    ALTER TABLE subscriptions
    DROP CONSTRAINT IF EXISTS fk_subscriptions_sub_id;
  `);

  // 2. Change column type back to TEXT
  await queryInterface.changeColumn("subscriptions", "sub_id", {
    type: DataTypes.TEXT,
    allowNull: true, // adjust if it was NOT NULL before
  });

  // 3. Rename column back
  await queryInterface.sequelize.query(`
    ALTER TABLE subscriptions
    RENAME COLUMN sub_id TO sub_type;
  `);
};
