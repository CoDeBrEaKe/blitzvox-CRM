import { DataTypes } from "sequelize";
import type { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.query(`
    ALTER TABLE emails
    ALTER COLUMN subject TYPE TEXT,
    ALTER COLUMN content TYPE TEXT;
  `);
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.query(`
    ALTER TABLE emails
    ALTER COLUMN subject TYPE VARCHAR(255),
    ALTER COLUMN content TYPE VARCHAR(255);
  `);
};
