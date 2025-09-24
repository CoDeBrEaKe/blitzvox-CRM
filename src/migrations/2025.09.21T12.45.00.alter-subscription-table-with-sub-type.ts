import { DataTypes } from "sequelize";
import type { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  const queryInterface = sequelize.getQueryInterface();

  // 1. If the column is enum, drop default/constraint first
  await queryInterface.sequelize.query(`
    ALTER TABLE subscriptions
    ALTER COLUMN sub_type DROP DEFAULT;
  `);

  // 2. Rename column
  await queryInterface.sequelize.query(`
    ALTER TABLE subscriptions
    RENAME COLUMN sub_type TO sub_id;
  `);

  // 3. Drop the enum type (optional, if not used elsewhere)
  await queryInterface.sequelize.query(`
    DROP TYPE IF EXISTS enum_subscriptions_sub_type;
  `);

  // 4. Change column type to BIGINT
  await queryInterface.sequelize.query(`
    ALTER TABLE subscriptions
    ALTER COLUMN sub_id TYPE BIGINT USING sub_id::text::BIGINT;
  `);

  // 5. Add foreign key
  await queryInterface.sequelize.query(`
    ALTER TABLE subscriptions
    ADD CONSTRAINT fk_subscriptions_sub_id
    FOREIGN KEY (sub_id) REFERENCES subscription_types(id);
  `);
};

export const down: Migration = async ({ context: sequelize }) => {
  const queryInterface = sequelize.getQueryInterface();

  // 1. Drop foreign key
  await queryInterface.sequelize.query(`
    ALTER TABLE subscriptions
    DROP CONSTRAINT IF EXISTS fk_subscriptions_sub_id;
  `);

  // 2. Change back to TEXT
  await queryInterface.changeColumn("subscriptions", "sub_id", {
    type: DataTypes.TEXT,
    allowNull: true,
  });

  // 3. Rename column back
  await queryInterface.sequelize.query(`
    ALTER TABLE subscriptions
    RENAME COLUMN sub_id TO sub_type;
  `);

  // 4. Recreate enum if needed (only if other code depends on it)
  await queryInterface.sequelize.query(`
    CREATE TYPE IF NOT EXISTS enum_subscriptions_sub_type AS ENUM ('your', 'enum', 'values');
  `);

  await queryInterface.changeColumn("subscriptions", "sub_type", {
    type: "enum_subscriptions_sub_type",
    allowNull: true,
  });
};
