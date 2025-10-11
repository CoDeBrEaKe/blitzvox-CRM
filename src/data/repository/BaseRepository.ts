import { Sequelize } from "sequelize-typescript";
import config from "../../config";
console.log(config.db);

export default class BaseRepository {
  sequelizeClient!: Sequelize;

  constructor() {
    if (
      config.db.database &&
      config.db.username &&
      config.db.port &&
      config.db.dialect
    ) {
      this.sequelizeClient = new Sequelize(
        config.db.database,
        config.db.username,
        config.db.password,
        {
          host: config.db.host,
          port: Number(config.db.port),
          dialect: config.db.dialect as any, // Ensure config.db.dialect is of type Dialect
          models: [__dirname + "/../../models"], // Adjust the path as necessary
        }
      );
    } else {
      return;
    }
  }
}
