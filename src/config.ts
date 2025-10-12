import dotenv from "dotenv";

// Load .env file
dotenv.config();

const config = {
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    dialect: process.env.DIALECT?.toString(),
    models: [__dirname + "/models"],
  },
};
console.log(config);
export default config;
