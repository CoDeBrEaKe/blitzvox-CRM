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

import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import Subscription from "./Subscription";
@Table({
  modelName: "Subscription_Type",
  tableName: "subscription_types",
})
export default class Subscription_Type extends Model<
  InferAttributes<Subscription_Type>,
  InferCreationAttributes<Subscription_Type>
> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @Default("")
  @Column
  declare sub_type: string;

  @Default("")
  @Column
  declare sub_image: string;

  @HasMany(() => Subscription)
  declare subscriptions?: InferAttributes<Subscription>[];

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
