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
  const {
    name,
    email,
    phone,
    company_name = "1",
    city,
    page = "1",
    limit = "10",
  } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  const where: WhereOptions<InferAttributes<Client>> = {};

  if (keys.length) {
    if (keys[0] == "name") {
      (where as any)[Op.or] = [
        {
          first_name: {
            [Op.iLike]: `%${(req as any).query[keys[0]]}%`,
          },
        },
        {
          family_name: {
            [Op.iLike]: `%${(req as any).query[keys[0]]}%`,
          },
        },
      ];
    } else {
      (where as any)[Op.or] = [
        { [keys[0]]: { [Op.iLike]: `%${(req as any).query[keys[0]]}%` } },
      ];
    }
  } else {
  }

  const clients = await Client.findAll({
    where,
    include: [
      { model: User }, // include User model
      {
        model: Subscription,
        attributes: ["sub_id"],
        include: [{ model: Subscription_Type }],
      },
      {
        model: Feedback,
        order: ["ASC"],
      },
      {
        model: Client_Sub,
        include: [{ model: User, attributes: ["name"] }],
      }, // include Client_Sub model
    ],

    limit: limitNum,
    offset: (pageNum - 1) * limitNum,
  });
  console.log(clients, clients.length);
  if (!clients) {
    return res.status(404).json({ message: "No clients found" });
  }
  res.status(200).json({ message: "Clients fetched successfully", clients });
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

  const result = await client?.update(updateData);
  console.log(result);
  return res
    .status(200)
    .json({ message: "Client updated successfully", client });
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
