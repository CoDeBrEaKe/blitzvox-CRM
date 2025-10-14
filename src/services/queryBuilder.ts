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
  private modelWheres: { [model: string]: any } = {};

  addWhere(col: string, val: any): this {
    const config = filterConfig[col];
    if (config) {
      const modelName = config[0].model;
      const isDate = config[0].isDate;

      if (config.length > 1) {
        // OR logic for multiple fields
        const orConditions = config.map((conf) => ({
          [conf.field]: {
            [conf.operator]: isDate
              ? val.map((v: string) => new Date(v))
              : `%${val}%`,
          },
        }));
        this.whereFor(modelName, Op.or, orConditions);
      } else {
        // Single field
        const conf = config[0];
        const value = isDate ? val.map((v: string) => new Date(v)) : `%${val}%`;
        console.log({
          modelName,
          field: conf.field,
          value,
          operator: conf.operator,
        });
        this.whereFor(modelName, conf.field, value, conf.operator);
      }
    }

    return this;
  }

  whereFor(
    model: string,
    field: string | symbol,
    value: any,
    operator?: any
  ): this {
    if (!this.modelWheres[model]) this.modelWheres[model] = {};

    if (field === Op.or || field === Op.and) {
      // Handle OR/AND operators
      this.modelWheres[model][field] = value;
    } else {
      // Handle regular field conditions
      this.modelWheres[model][field] = { [operator || Op.eq]: value };
    }

    return this;
  }

  withAuthorization(userId: number, role: string): this {
    if (role !== "admin") {
      this.whereFor("Client_Sub", "user_id", userId);
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

  paginate(page: number, limit: number | undefined): this {
    this.query.limit = limit;
    this.query.offset = (page - 1) * (limit || 0);
    return this;
  }

  options(raw: boolean, nest: boolean): this {
    this.query.raw = raw;
    this.query.nest = nest;
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
    // Apply main model WHERE (Client_Sub)
    if (this.modelWheres["Client_Sub"]) {
      this.query.where = this.modelWheres["Client_Sub"];
    }

    // Apply included model WHEREs
    this.includes.forEach((include) => {
      const modelName = include.model.name;
      if (this.modelWheres[modelName]) {
        include.where = this.modelWheres[modelName];
      }
    });

    if (this.includes.length) this.query.include = this.includes;
    return this.query;
  }
}

export default QueryBuilder;
