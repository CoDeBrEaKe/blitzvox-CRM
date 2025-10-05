import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
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
  declare subject: string;

  @AllowNull(false)
  @Column
  declare content: string;

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
