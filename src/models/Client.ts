import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
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
import User from "./User";
import Feedback from "./Feedback";
import Subscription from "./Subscription";
import Client_Sub from "./Client_Sub";
@Table({
  modelName: "Client",
  tableName: "clients",
})
export default class Client extends Model<
  InferAttributes<Client>,
  InferCreationAttributes<Client>
> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @Column
  declare title?: string;
  @Column
  declare first_name?: string;
  @Column
  declare family_name?: string;
  @Column
  declare company_name?: string;
  @Column
  declare street?: string;
  @Column
  declare house_num?: string;
  @Column
  declare zip_code?: string;
  @Column
  declare city?: string;
  @Column
  declare birth_date?: Date;
  @Column
  declare phone?: string;
  @Column
  declare email?: string;
  @Column
  declare admin_note?: string;
  @Column
  declare document_link: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
  })
  declare user_id: number;

  @CreatedAt
  declare created_at: CreationOptional<Date>;
  @UpdatedAt
  declare updated_at: CreationOptional<Date>;

  @BelongsToMany(() => Subscription, () => Client_Sub)
  declare subscriptions: InferAttributes<Subscription>[];
  @BelongsTo(() => User)
  declare assignedTo?: InferAttributes<User>;
  @HasMany(() => Feedback)
  declare feedbacks?: InferAttributes<Feedback>[];

  toJSON() {
    return {
      ...this.get(),
    };
  }
}
