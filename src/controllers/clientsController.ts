import { Express, Request, Response } from "express";
import Client from "../models/Client";
import User from "../models/User";
import Subscription from "../models/Subscription";
import Feedback from "../models/Feedback";
import Subscription_Type from "../models/Subscription_Type";
import Client_Sub from "../models/Client_Sub";
import { InferAttributes, Op, WhereOptions } from "sequelize";
import formidable from "formidable";
import fs from "fs/promises";
import { parse } from "csv-parse/sync";
import dateConverter from "../utils/date";
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

  let where: WhereOptions<InferAttributes<Client>> = {};
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
      where: role === "admin" ? undefined : { user_id: id },
      include: [
        { model: User },
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
        {
          model: User,
          where: role === "admin" ? undefined : { id: id },
        },
        {
          model: Subscription,
          where: where,
          required: true,
        },
      ],
    });
  } else {
    // When not filtering by subscriptions
    let whereConditions = [where];
    if (role !== "admin") {
      whereConditions.push({ user_id: id });
    }
    clients = await Client.findAll({
      where: where, // Apply where to clients
      include: [
        { model: User },
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

    totalCount = await Client.count({
      where: whereConditions,
      // Apply where to subscriptions
    });
  }

  if (!clients) {
    return res.status(404).json({ message: "No clients found" });
  }
  return res.status(200).json({
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

export const importFile = async (req: Request, res: Response) => {
  try {
    const form = formidable({ multiples: false });

    const [fields, files] = await new Promise<
      [formidable.Fields, formidable.Files]
    >((resolve, reject) => {
      form.parse(req as any, (err, fields, files) => {
        if (err) {
          reject(err);
        }
        resolve([fields, files]);
      });
    });

    if (!files.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileContent = await fs.readFile(file.filepath, "latin1");

    const records = parse(fileContent.toString(), {
      columns: true, // Automatically parse headers as column names
      skip_empty_lines: true,
      trim: true,
      delimiter: ",",
    });

    const results: any[] = [];
    let count = 0;

    for (const row of records as any) {
      count++;
      try {
        // Find or create client
        let client = await Client.findOne({
          where: {
            first_name: row["Vorname"],
            family_name: row["Nachname"],
            email: row["E-Mail"],
          },
        });

        let user = await User.findOne({ where: { name: row["VP-Name"] } });
        if (!user) user = await User.findByPk(1);

        if (!client && user) {
          client = await Client.create({
            first_name: row["Vorname"],
            family_name: row["Nachname"],
            title: row["Anrede"],
            street: row["Straße"],
            house_num: row["Hausnummer"],
            zip_code: row["PLZ"],
            city: row["Ort"],
            birth_date: dateConverter(row["Geburtsdatum"]),
            phone: row["Telefonnummer"],
            email: row["E-Mail"],
            user_id: user.id,
          });
        }

        // Find or create subscription
        let sub = await Subscription.findOne({
          where: { sub_name: row["Tarif/Produkt"] },
        });
        if (!sub) {
          sub = await Subscription.create({
            sub_name: row["Tarif/Produkt"],
            sub_id: 2,
            company: "test",
          });
        }

        if (user && client) {
          const clientSub = await Client_Sub.create({
            user_id: user.id,
            client_id: client?.id,
            sub_id: sub.id,
            order_num: row["Auftr.-Nr."],
            your_order_num: row["Ihre Auftr.-Nr."],
            createdAt: dateConverter(row["Anlagedatum"]),
            sign_date: dateConverter(row["Unterschriftsdatum"]),
            status: row["Auftr.-Status"],
            counter_number: row["Zählernummer"],
            consumption: Number(row["Verbrauch"]),
            night_consumption: Number(row["Verbrauch NT"]),
            paid: row["VAP"] == "Nein" ? false : true,
            paid_date: dateConverter(row["VAP-Datum"]),
            rl: row["RL"] == "Nein" ? false : true,
            rl_date: dateConverter(row["RL-Datum"]),
            termination_date: dateConverter(row["Stornodatum"]),
            restablish_date: dateConverter(row["Wiederanschaltungsdatum"]),
            start_importing: dateConverter(row["Lieferbeginn"]),
            contract_end: dateConverter(row["Vertragsende"]),
          });
          results.push(clientSub);
        }
      } catch (err: any) {
        results.push({ error: err.message, row });
        continue; // Continue to next row
      }
    }

    // Send response after all rows are processed
    return res.status(200).json({
      success: true,
      processed: count,
      results,
      message: "Data proccessed successfully",
    });
  } catch (error) {
    console.error("Error processing CSV:", error);
    return res.status(500).json({
      message: "Failed processing the file",
    });
  }
};
