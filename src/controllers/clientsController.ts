import { Express, Request, Response } from "express";
import Client from "../models/Client";
import User from "../models/User";
import Subscription from "../models/Subscription";
import Feedback from "../models/Feedback";
import Subscription_Type from "../models/Subscription_Type";
import Client_Sub from "../models/Client_Sub";
import { InferAttributes, Op, WhereOptions } from "sequelize";

interface UserQueryParams {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  company_name?: string;
  page?: string;
  limit?: string;
}
export const getClients = async (
  req: Request<{}, {}, {}, UserQueryParams>,
  res: Response
) => {
  const keys = Object.keys(req.query);
  const { page = "1", limit = "10" } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  const where: WhereOptions<InferAttributes<Client>> = {};
  if (keys.length > 2) {
    if (keys[2] == "subscriptions") {
      (where as any)[Op.or] = [
        {
          sub_name: {
            [Op.iLike]: `%${(req as any).query[keys[2]]}%`,
          },
        },
      ];
    } else if (keys[2] == "first_name") {
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
    } else {
      (where as any)[Op.or] = [
        { [keys[2]]: { [Op.iLike]: `%${(req as any).query[keys[2]]}%` } },
      ];
    }
  }

  let clients;
  let totalCount;
  const { id, role } = (req as any).user.dataValues;
  if (keys[2] == "subscriptions") {
    // When filtering by subscriptions

    clients = await Client.findAll({
      include: [
        { model: User, where: { id: role == "admin" ? "" : id } },
        {
          model: Subscription,
          where: where, // Apply where to subscriptions
          required: true, // This makes it an INNER JOIN for subscriptions
          include: [{ model: Subscription_Type }],
        },
        {
          model: Feedback,
          order: ["ASC"],
        },
        {
          model: Client_Sub,
          include: [{ model: User, attributes: ["name"] }],
        },
      ],
      limit: limitNum,
      offset: (pageNum - 1) * limitNum,
    });
    totalCount = await Client.count({
      include: [
        { model: User, where: { id: role == "admin" ? {} : id } },
        {
          model: Subscription,
          where: where, // Apply where to subscriptions
          required: true, // This makes it an INNER JOIN for subscriptions
          include: [{ model: Subscription_Type }],
        },
      ],
    });
  } else {
    // When not filtering by subscriptions
    clients = await Client.findAll({
      where: where, // Apply where to clients
      include: [
        { model: User, where: { id: role == "admin" ? "" : id } },
        {
          model: Subscription,
          include: [{ model: Subscription_Type }],
        },
        {
          model: Feedback,
          order: ["ASC"],
        },
        {
          model: Client_Sub,
          include: [{ model: User, attributes: ["name"] }],
        },
      ],
      limit: limitNum,
      offset: (pageNum - 1) * limitNum,
    });

    totalCount = totalCount = await Client.count({
      where: [where, { id: role == "admin" ? "" : id }],
      include: [{ model: User, where: { id: role == "admin" ? "" : id } }], // Apply where to subscriptions
    });
  }

  if (!clients) {
    return res.status(404).json({ message: "No clients found" });
  }
  res.status(200).json({
    message: "Clients fetched successfully",
    clients,
    pagination: {
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      totalItems: totalCount,
      itemsPerPage: limitNum,
      hasNext: pageNum * limitNum < totalCount,
      hasPrev: pageNum > 1,
    },
  });
};

export const createClient = async (req: Request, res: Response) => {
  const clientData = req.body;
  const newClient = await Client.create({
    ...clientData,
    user_id: (req as any).user.dataValues.id,
  });

  return res.status(201).json({ message: "Client created", client: newClient });
};

export const getClientById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const client = await Client.findByPk(id, {
      include: [
        { model: User }, // include User model
        {
          model: Client_Sub,
          include: [{ model: User }],
        }, // include Client_Sub model
        {
          model: Subscription,
          include: [{ model: Subscription_Type }],
        },
        { model: Feedback },
      ],
      order: [["feedbacks", "created_at", "DESC"]],
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    return res
      .status(200)
      .json({ message: "Client fetched successfully", client });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching client", error });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  let client = await Client.findByPk(id);
  if (!client) {
    res.status(404).json({ message: "No Clients found" });
  }

  try {
    const result = await client?.update(updateData);
    return res
      .status(200)
      .json({ message: "Client updated successfully", client });
  } catch (e) {
    return res.status(500).json({ message: "Er is iets misgegaan" });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  if ((req as any).user.dataValues.role !== "admin") {
    return res.status(403).json({ message: "Only admins can delete clients" });
  }

  try {
    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    await client.destroy();
    return res.status(200).json({ message: "Client Deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Something wrong happened" });
  }
};
