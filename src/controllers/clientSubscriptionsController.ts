import { Request, Response } from "express";
import Client_Sub from "../models/Client_Sub";
import Client from "../models/Client";
import Subscription from "../models/Subscription";
import Subscription_Type from "../models/Subscription_Type";
import User from "../models/User";
import { formatDate } from "../utils/date";
import path from "path";
// Store file in memory for S3 upload
import { uploadDocument, listDocuments } from "../utils/s3";
import Feedback from "../models/Feedback";
import QueryBuilder from "../services/queryBuilder";

interface UserQueryParams {
  "client.name"?: string;
  your_order_num?: string;
  sign_date?: string;
  "subscription.sub_name"?: string;
  counter_number?: string;
  "subscription.type.sub_image"?: string;
  page?: string;
  limit?: string;
  date?: { [key: string]: string[] };
}
const baseUrl =
  process.env.NODE_ENV == "production"
    ? "https://med-health.site"
    : "http://127.0.0.1:3000";

export const getClientSubscribtions = async (
  req: Request<{}, {}, {}, UserQueryParams>,
  res: Response
) => {
  const { page = "1", limit } = req.query;
  const pageNum = parseInt(page);
  const limitNum = limit == "undefined" ? undefined : parseInt(limit!);
  const { id, role } = (req as any).user.dataValues;

  // Get the search column and value (you'll need to adjust this logic)
  const date = req.body;
  const col = (date as any).date ? Object.keys((date as any).date)[0] : null;
  const searchCol = Object.keys(req.query)[2]; // You might want a better way to get search params
  const searchValue = req.query[searchCol as keyof UserQueryParams];
  try {
    const queryBuilder = new QueryBuilder()
      .withAuthorization(id, role)
      .paginate(pageNum, limitNum)
      .options(true, false);
    if (searchCol && searchValue) {
      queryBuilder.addWhere(searchCol, searchValue);
    }
    if (col && (date as any).date[col].length)
      queryBuilder.addWhere(col, (date as any).date[col as keyof typeof date]);

    queryBuilder
      .include("User")
      .include("Feedback")
      .include("Client")
      .include("Subscription", undefined, [{ model: Subscription_Type }]);

    const query = queryBuilder.build();
    // Execute both count and find in parallel
    const [clientSubsCountRaw, clientSubs] = await Promise.all([
      Client_Sub.count(query),
      Client_Sub.findAll(query),
    ]);

    // If count is grouped, extract the total count
    let clientSubsCount: number;
    if (Array.isArray(clientSubsCountRaw)) {
      clientSubsCount = clientSubsCountRaw.reduce(
        (sum, item: any) => sum + (item.count ? Number(item.count) : 0),
        0
      );
    } else {
      clientSubsCount = Number(clientSubsCountRaw);
    }

    res.status(200).json({
      message: "Subscriptions Fetched successfully",
      clientSubs: clientSubs.map((sub) => ({
        ...sub,
        sign_date: formatDate(sub?.sign_date),
        start_importing: formatDate(sub?.start_importing),
        end_importing: formatDate(sub?.end_importing),
      })),
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(
          Number(clientSubsCount) / (limitNum || Number(clientSubsCount))
        ),
        totalItems: clientSubsCount,
        itemsPerPage: limitNum,
        hasNext: pageNum * (limitNum || clientSubsCount) < clientSubsCount,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went Wrong" });
  }
};

export const getSingleClientSubscribtion = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const clientSub = await Client_Sub.findByPk(id, {
    include: [
      { model: User, nested: true },
      { model: Feedback },

      { model: Client },
      {
        model: Subscription,
        include: [
          {
            model: Subscription_Type,
          },
        ],
      },
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

  let prevSub = await Client_Sub.findOne({
    where: { client_id: data.client_id, sub_id: data.sub_id },
  });
  if (prevSub) {
    return res
      .status(400)
      .json({ message: "This client already has this subscription" });
  }

  const clientSub = await Client_Sub.create({
    ...data,
  });

  res.status(201).json({
    message: "Subscribtion created successfully",
    clientSub,
  });
};

export const updateClientSub = async (req: Request, res: Response) => {
  const data = req.body;
  const { id } = req.params;
  try {
    let clientSub = await Client_Sub.findByPk(id);
    if (!clientSub) {
      return res.status(404).json({ message: "Something went Wrong" });
    }
    clientSub = await clientSub.update({
      ...data,
    });
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

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const { firstName, clientId, subscriptionId } = req.body;
    const file = req.file;
    if (!file || !firstName || !clientId || !subscriptionId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const key = await uploadDocument(
      firstName,
      clientId,
      subscriptionId,
      file.originalname,
      file.buffer,
      file.mimetype
    );

    res.json({ success: true, key }).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
};
