import dotenv from "dotenv";

// Load .env file
dotenv.config();

const config = {
  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "",
    dialect: "postgres",
  },
};

export default config;
