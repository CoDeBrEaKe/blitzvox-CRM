import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript";

import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import Client from "./Client";
import Client_Sub from "./Client_Sub";

@Table({
  tableName: "feedbacks",
  modelName: "Feedback",
})
export default class Feedback extends Model<
  InferAttributes<Feedback>,
  InferCreationAttributes<Feedback>
> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: CreationOptional<number>;

  @AllowNull(false)
  @Column
  declare feedback: string;

  @ForeignKey(() => Client)
  @Column
  declare client_id?: number;

  @ForeignKey(() => Client_Sub)
  @Column
  declare client_sub_id?: number;

  @BelongsTo(() => Client)
  declare client?: InferAttributes<Client>;

  @BelongsTo(() => Client_Sub)
  declare client_sub?: InferAttributes<Client_Sub>;

  @CreatedAt
  declare created_at?: CreationOptional<Date>;
  @UpdatedAt
  declare updated_at?: CreationOptional<Date>;
  toJSON() {
    return {
      ...this.get(),
      id: undefined,
    };
  }
}
