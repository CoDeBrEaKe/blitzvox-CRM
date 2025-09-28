import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
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
import Subscription from "./Subscription";
import User from "./User";

export enum TIME {
  oneYear = "1 Year",
  twoYear = "2 Years",
}

@Table({
  modelName: "Client_Sub",
  tableName: "client_sub",
})
export default class Client_Sub extends Model<
  InferAttributes<Client_Sub>,
  InferCreationAttributes<Client_Sub>
> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @Column
  declare order_num?: string;
  @Column
  declare your_order_num?: string;
  @Default(0)
  @Column
  declare cost?: number;
  @Column
  declare status?: string;
  @Column
  declare counter_number?: string;
  @Column
  declare consumption?: number;
  @Column
  declare night_consumption?: number;
  @Column
  declare paid?: boolean;
  @Column
  declare paid_date?: Date;
  @Column
  declare rl?: boolean;
  @Column
  declare rl_date?: Date;
  @Column
  declare termination_date?: Date;
  @Column
  declare restablish_date?: Date;
  @Column
  declare sign_date?: Date;
  @Column
  declare start_importing?: Date;
  @Column
  declare end_importing?: Date;
  // Not used property
  @Column
  declare contract_end?: Date;
  @Column({
    type: DataType.ENUM(...Object.values(TIME)),
  })
  declare contract_time?: TIME;
  @Column
  declare family_count?: number;
  @Column
  declare persons_num?: number;
  @Column
  declare persons_name?: string;
  @Column
  declare documents_link?: string;

  @ForeignKey(() => Client)
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  declare client_id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  declare user_id: number;

  @ForeignKey(() => Subscription)
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  declare sub_id: number;

  @BelongsTo(() => User, "user_id")
  declare creator?: InferAttributes<User>;
}
