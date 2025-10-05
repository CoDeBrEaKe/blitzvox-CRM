import { Request, Response } from "express";
import Subscription from "../models/Subscription";
import Subscription_Type from "../models/Subscription_Type";
import { InferAttributes, WhereOptions } from "sequelize";
import Client from "../models/Client";
import { Op } from "sequelize";

interface UserQueryParams {
  company?: string;
  sub_name?: string;
  sub_type?: string;
  page?: string;
  limit?: string;
}

export const createSubscription = async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const newSubscription = await Subscription.create(data);
    return res
      .status(201)
      .json({ message: "Subscription created", Subscription: newSubscription });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating Subscription", error });
  }
};

export const updateSubscription = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const subscription = await Subscription.findByPk(id);
    if (!subscription) {
      return res.status(404).json({ message: "subscription not found" });
    }
    await subscription.update(updateData);
    return res
      .status(200)
      .json({ message: "Feedback updated", subscription: subscription });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating subscription", error });
  }
};

export const deleteSubscription = async (req: Request, res: Response) => {
  const { id } = req.params;
  const subscription = await Subscription.findByPk(id);
  if (!subscription) {
    return res.status(404).json({ message: "subscription not found" });
  }
  await subscription.destroy();
  try {
    return res.status(200).json({ message: "subscription Deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Something wrong happened" });
  }
};

export const getSubscriptions = async (
  req: Request<{}, {}, {}, UserQueryParams>,
  res: Response
) => {
  const keys = Object.keys(req.query);
  const { page = "1", limit = "10" } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  const where: WhereOptions<InferAttributes<Client>> = {};
  if (keys.length > 2) {
    if (keys[2] == "type.sub_type") {
      (where as any)[Op.or] = [
        { sub_type: { [Op.iLike]: `%${(req as any).query[keys[2]]}%` } },
      ];
    } else {
      (where as any)[Op.or] = [
        { [keys[2]]: { [Op.iLike]: `%${(req as any).query[keys[2]]}%` } },
      ];
    }
  }

  try {
    const subscriptions = await Subscription.findAll({
      where: keys.length && keys[2] != "type.sub_type" ? where : {},
      include: {
        model: Subscription_Type,
        where: keys.length && keys[2] == "type.sub_type" ? where : {},
      },
      raw: true,
      nest: false,
      limit: limitNum,
      offset: (pageNum - 1) * limitNum,
    });
    if (!subscriptions) {
      return res.status(404).json({ message: "No subscriptions found" });
    }

    const totalCount = await Subscription.count({
      where: keys.length && keys[2] != "type.sub_type" ? where : {},
      include: {
        model: Subscription_Type,
        where: keys.length && keys[2] == "type.sub_type" ? where : {},
      },
    });
    return res.status(200).json({
      Message: "Subscriptions fetched succeffully",
      subscriptions,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalItems: totalCount,
        itemsPerPage: limitNum,
        hasNext: pageNum * limitNum < totalCount,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching subscriptions", error });
  }
};

export const getSubscriptionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const subscription = await Subscription.findByPk(id, {
      include: { model: Subscription_Type },
      raw: true,
      nest: false,
    });
    if (!subscription) {
      return res.status(404).json({ message: "subscription not found" });
    }
    return res
      .status(200)
      .json({ message: "subscription fetched successfully", subscription });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching subscription", error });
  }
};
