import { DataTypes } from "sequelize";
import type { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  const queryInterface = sequelize.getQueryInterface();

  await queryInterface.sequelize.transaction(async (t) => {
    // Step 1: Ensure subscription_types has entries for existing enum values
    await queryInterface.sequelize.query(
      `
      INSERT INTO subscription_types (sub_type, created_at, updated_at)
      SELECT unnest(enum_range(NULL::enum_subscriptions_sub_type)) AS sub_type,
             CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      WHERE NOT EXISTS (
        SELECT 1 FROM subscription_types WHERE sub_type = unnest(enum_range(NULL::enum_subscriptions_sub_type))
      );
      `,
      { transaction: t }
    );

    // Step 2: Drop default value for sub_id (if any)
    await queryInterface.sequelize.query(
      `
      ALTER TABLE subscriptions
      ALTER COLUMN sub_id DROP DEFAULT;
      `,
      { transaction: t }
    );

    // Step 3: Change sub_id column type to BIGINT with data mapping
    await queryInterface.sequelize.query(
      `
      ALTER TABLE subscriptions
      ALTER COLUMN sub_id TYPE BIGINT USING (
        SELECT id FROM subscription_types WHERE sub_type = subscriptions.sub_id::text
      );
      `,
      { transaction: t }
    );

    // Step 4: Add foreign key constraint
    await queryInterface.sequelize.query(
      `
      ALTER TABLE subscriptions
      ADD CONSTRAINT fk_subscriptions_sub_id
      FOREIGN KEY (sub_id) REFERENCES subscription_types(id) ON DELETE RESTRICT ON UPDATE CASCADE;
      `,
      { transaction: t }
    );

    // Step 5: Drop the enum type
    await queryInterface.sequelize.query(
      `
      DROP TYPE IF EXISTS enum_subscriptions_sub_type;
      `,
      { transaction: t }
    );
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  const queryInterface = sequelize.getQueryInterface();

  await queryInterface.sequelize.transaction(async (t) => {
    // Step 1: Recreate the enum type
    await queryInterface.sequelize.query(
      `
      CREATE TYPE enum_subscriptions_sub_type AS ENUM ('electricity', 'gas', 'internet', 'health insurance');
      `,
      { transaction: t }
    );

    // Step 2: Drop the foreign key constraint
    await queryInterface.sequelize.query(
      `
      ALTER TABLE subscriptions
      DROP CONSTRAINT IF EXISTS fk_subscriptions_sub_id;
      `,
      { transaction: t }
    );

    // Step 3: Change sub_id back to the enum type with reverse mapping
    await queryInterface.sequelize.query(
      `
      ALTER TABLE subscriptions
      ALTER COLUMN sub_id TYPE enum_subscriptions_sub_type USING (
        SELECT sub_type::enum_subscriptions_sub_type
        FROM subscription_types
        WHERE subscription_types.id = subscriptions.sub_id
      );
      `,
      { transaction: t }
    );

    // Step 4: Optionally clean up subscription_types (if needed)
    // Note: Be cautious, as other tables might reference subscription_types
    // await queryInterface.sequelize.query(
    //   `TRUNCATE TABLE subscription_types;`,
    //   { transaction: t }
    // );
  });
};
