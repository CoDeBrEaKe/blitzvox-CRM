import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

@Table({
  tableName: "emails",
  modelName: "Email",
})
export default class Email extends Model<
  InferAttributes<Email>,
  InferCreationAttributes<Email>
> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @AllowNull(false)
  @Column
  declare subject: String;

  @AllowNull(false)
  @Column
  declare content: String;

  @CreatedAt
  declare created_at: CreationOptional<Date>;
  @UpdatedAt
  declare updated_at: CreationOptional<Date>;
}
