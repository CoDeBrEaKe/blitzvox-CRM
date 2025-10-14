import { Op } from "sequelize";
import { filterConfig } from "../utils/filterConfig";
import Client from "../models/Client";
import User from "../models/User";
import Feedback from "../models/Feedback";
import Subscription from "../models/Subscription";
import Subscription_Type from "../models/Subscription_Type";
import Client_Sub from "../models/Client_Sub";
import Email from "../models/Email";

class QueryBuilder {
  private query: any = {};
  private includes: any[] = [];
  addWhere(col: string, val: any): this {
    const config = filterConfig[col];

    if (config) {
      if (!this.query.where) this.query.where = {};

      if (config.length > 1) {
        // Build proper Sequelize format: { field: { [Op.iLike]: '%value%' } }
        this.query.where[Op.or] = config.map((conf) => ({
          [conf.field]: { [conf.operator]: `%${val}%` },
        }));
      } else {
        const conf = config[0];
        this.query.where[conf.field] = { [conf.operator]: `%${val}%` };
      }
    }

    return this;
  }

  include(model: string, where?: any, nestedInclude?: any[]): this {
    const includeItem: any = {
      model: this.getModel(model),
    };
    if (where) includeItem.where = where;
    if (nestedInclude) includeItem.include = nestedInclude;

    this.includes.push(includeItem);
    return this;
  }

  paginate(page: number, limit: number): this {
    this.query.limit = limit;
    this.query.offset = (page - 1) * limit;
    return this;
  }
  options(nest: boolean, raw: boolean): this {
    this.query.nest = nest;
    this.query.raw = raw;
    return this;
  }
  private getModel(modelName: string) {
    const modelsDict: { [name: string]: any } = {
      User: User,
      Client: Client,
      Feedback: Feedback,
      Subscription: Subscription,
      Subscription_Type: Subscription_Type,
      Client_Sub: Client_Sub,
      Email: Email,
    };

    return modelsDict[modelName];
  }

  build() {
    if (this.includes.length) this.query.include = this.includes;
    return this.query;
  }
}
