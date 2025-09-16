import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
export enum SUB {
  electricity = "electricity",
  gas = "gas",
  internet = "internet",
}
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import Client from "./Client";
import Client_Sub from "./Client_Sub";
@Table({
  modelName: "Subscription",
  tableName: "subscriptions",
})
export default class Subscription extends Model<
  InferAttributes<Subscription>,
  InferCreationAttributes<Subscription>
> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @Column({
    type: DataType.ENUM(...Object.values(SUB)),
  })
  declare sub_type?: SUB;

  @Default("")
  @Column
  declare company?: string;

  @BelongsToMany(() => Client, () => Client_Sub)
  declare clients: InferAttributes<Client>[];

  @CreatedAt
  declare created_at: CreationOptional<Date>;
  @UpdatedAt
  declare updated_at: CreationOptional<Date>;
  toJSON() {
    return {
      ...this.get(),
      id: undefined,
    };
  }
}
