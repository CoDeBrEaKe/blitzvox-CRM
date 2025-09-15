import {
  Column,
  Model,
  DataType,
  Table,
  AllowNull,
  Unique,
  Default,
  HasMany,
} from "sequelize-typescript";
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

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
  declare name: String;

  @AllowNull(false)
  @Unique
  @Column
  declare username: String;

  @AllowNull(false)
  @Default("")
  @Column
  declare password: String;

  @AllowNull(false)
  @Default("agent")
  @Column({
    type: DataType.ENUM(...Object.values(Role)),
  })

  // @HasMany(()=>Client)
  // declare clients: Client[];
  declare role: Role;
  toJSON() {
    return {
      ...this.get(),
      password: undefined,
    };
  }
}
