import dotenv from "dotenv";

// Load .env file
dotenv.config();

const config = {
  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "123456",
    database: process.env.DB_DATABASE || "blitzvox_db",
    dialect: "postgres",
    models: [__dirname + "/models"],
  },
};

export default config;
