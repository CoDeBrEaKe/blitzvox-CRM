import { Request, Response } from "express";
import Client_Sub from "../models/Client_Sub";
import Client from "../models/Client";
import Subscription from "../models/Subscription";
import Subscription_Type from "../models/Subscription_Type";
import User from "../models/User";
import { InferAttributes, Op, WhereOptions } from "sequelize";

interface UserQueryParams {
  "client.name"?: string;
  your_order_num?: string;
  sign_date?: string;
  "subscription.sub_name"?: string;
  counter_number?: string;
  "subscription.type.sub_image"?: string;
  page?: string;
  limit?: string;
}

export const getClientSubscribtions = async (
  req: Request<{}, {}, {}, UserQueryParams>,
  res: Response
) => {
  const keys = Object.keys(req.query);
  const { page = "1", limit = "10" } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  let where: WhereOptions<InferAttributes<Client_Sub>> = {};

  if (keys.length > 2) {
    let col = keys[2].split(".")[keys[2].split(".").length - 1];
    if (keys[2] == "subscription.type.sub_image") {
      (where as any)[Op.or] = [
        {
          sub_type: {
            [Op.iLike]: `%${(req as any).query[keys[2]]}%`,
          },
        },
      ];
    } else if (keys[2] == "client.first_name") {
      (where as any)[Op.or] = [
        {
          first_name: {
            [Op.iLike]: `%${(req as any).query[keys[2]]}%`,
          },
        },
        {
          family_name: {
            [Op.iLike]: `%${(req as any).query[keys[2]]}%`,
          },
        },
      ];
    } else if (keys[2] == "sign_date") {
      (where as any) = {
        sign_date: {
          [Op.between]: [
            new Date((req as any).query[keys[2]]), // start date from query
            new Date(), // current time
          ],
        },
      };
    } else {
      (where as any) = [
        {
          [col]: {
            [Op.iLike]: `%${(req as any).query[keys[2]]}%`,
          },
        },
      ];
    }
  }
  const clientSubs = await Client_Sub.findAll({
    where:
      keys.length &&
      keys[2] != "client.first_name" &&
      keys[2] != "subscription.sub_name" &&
      keys[2] != "subscription.type.sub_image"
        ? where
        : {},
    include: [
      { model: User },
      {
        model: Client,
        where: keys.length && keys[2] == "client.first_name" ? where : {},
      },
      {
        model: Subscription,

        where: keys.length && keys[2] == "subscription.sub_name" ? where : {},
        include: [
          {
            model: Subscription_Type,
            where:
              keys.length && keys[2] == "subscription.type.sub_image"
                ? where
                : {},
          },
        ],
      },
    ],
    raw: true,
    nest: false,
    limit: limitNum,
    offset: (pageNum - 1) * limitNum,
  });
  const clientSubsCount = await Client_Sub.count({
    where:
      keys.length &&
      keys[2] != "client.first_name" &&
      keys[2] != "subscription.sub_name" &&
      keys[2] != "subscription.type.sub_image"
        ? where
        : {},
    include: [
      { model: User },
      {
        model: Client,
        where: keys.length && keys[2] == "client.first_name" ? where : {},
      },
      {
        model: Subscription,

        where: keys.length && keys[2] == "subscription.sub_name" ? where : {},
        include: [
          {
            model: Subscription_Type,
            where:
              keys.length && keys[2] == "subscription.type.sub_image"
                ? where
                : {},
          },
        ],
      },
    ],
  });
  if (!clientSubs) {
    return res
      .status(404)
      .json({ message: "No Subscribtions for this client yet" });
  }
  res.status(200).json({
    message: "Subscriptions Fetched successfully",
    clientSubs,
    pagination: {
      currentPage: pageNum,
      totalPages: Math.ceil(clientSubsCount / limitNum),
      totalItems: clientSubsCount,
      itemsPerPage: limitNum,
      hasNext: pageNum * limitNum < clientSubsCount,
      hasPrev: pageNum > 1,
    },
  });
};

export const getSingleClientSubscribtion = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const clientSub = await Client_Sub.findByPk(id, {
    include: [
      { model: User },
      { model: Client },
      { model: Subscription, include: [{ model: Subscription_Type }] },
    ],
    raw: true,
    nest: false,
  });
  if (!clientSub) {
    return res.status(404).json({ message: "No Subscribtion found" });
  }
  res
    .status(200)
    .json({ message: "No Subscribtions for this client yet", clientSub });
};

export const createClientSub = async (req: Request, res: Response) => {
  const data = req.body;

  const clientSub = await Client_Sub.create(data);
  res
    .status(201)
    .json({ message: "Subscribtion created successfully", clientSub });
};

export const updateClientSub = async (req: Request, res: Response) => {
  const data = req.body;
  const { id } = req.params;
  try {
    let clientSub = await Client_Sub.findByPk(id);
    if (!clientSub) {
      return res.status(404).json({ message: "Something went Wrong" });
    }
    clientSub = await clientSub.update(data);
    res
      .status(201)
      .json({ message: "Subscribtion updated successfully", clientSub });
  } catch (error) {
    res.status(500).json({ message: "Something went Wrong" });
  }
};

export const deleteClientSub = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    let clientSub = await Client_Sub.findByPk(id);
    if (!clientSub) {
      return res.status(404).json({ message: "Something went Wrong" });
    }
    await clientSub.destroy();
    res
      .status(200)
      .json({ message: "Client subscription deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went Wrong" });
  }
};
