import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
export enum SUB {
  electricity = "electricity",
  gas = "gas",
  internet = "internet",
  health_insurance = "health insurance",
}
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import Client from "./Client";
import Client_Sub from "./Client_Sub";
import Subscription_Type from "./Subscription_Type";
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

  @ForeignKey(() => Subscription_Type)
  @Column({
    type: DataType.BIGINT,
  })
  declare sub_id?: number;

  @Default("")
  @Column
  declare sub_name: string;

  @Default("")
  @Column
  declare company?: string;

  @BelongsToMany(() => Client, () => Client_Sub)
  declare clients: InferAttributes<Client>[];

  @BelongsTo(() => Subscription_Type)
  declare type?: InferAttributes<Subscription_Type>;

  @CreatedAt
  declare created_at: CreationOptional<Date>;
  @UpdatedAt
  declare updated_at: CreationOptional<Date>;
  toJSON() {
    return {
      ...this.get(),
    };
  }
}
