import { Sequelize } from "sequelize-typescript";
import config from "../../config";

export default class BaseRepository {
  sequelizeClient!: Sequelize;

  constructor() {
    if (config.db.database && config.db.username && config.db.port) {
      this.sequelizeClient = new Sequelize(
        config.db.database,
        config.db.username,
        config.db.password,
        {
          host: config.db.host,
          port: Number(config.db.port),
          dialect: "postgres",
          models: [__dirname + "/../../models"], // Adjust the path as necessary
        }
      );
    } else {
      return;
    }
  }
}
