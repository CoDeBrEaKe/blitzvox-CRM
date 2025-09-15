import {
  Column,
  Model,
  DataType,
  Table,
  AllowNull,
  Unique,
  Default,
  HasMany,
  BelongsToMany,
} from "sequelize-typescript";
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import Client from "./Client";

enum Role {
  ADMIN = "admin",
  AGENT = "agent",
}

@Table({
  modelName: "User",
  tableName: "users",
})
export default class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @Column({
    primaryKey: true,
    type: DataType.BIGINT,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @AllowNull(false)
  @Default("")
  @Column
  declare name: string;

  @AllowNull(false)
  @Unique
  @Column
  declare username: string;

  @AllowNull(false)
  @Column
  declare password: string;

  @AllowNull(false)
  @Default("agent")
  @Column({
    type: DataType.ENUM(...Object.values(Role)),
  })
  @HasMany(() => Client)
  declare clients?: InferAttributes<Client>[];

  declare role: Role;
  toJSON() {
    return {
      ...this.get(),
      id: undefined,
      password: undefined,
    };
  }
}
