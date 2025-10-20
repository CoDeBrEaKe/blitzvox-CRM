import { Request, Response } from "express";
import Subscription_Type from "../models/Subscription_Type";
import { InferAttributes, WhereOptions } from "sequelize";
import { Op } from "sequelize";
import { uploadDocument } from "../utils/s3";

interface UserQueryParams {
  sub_type?: string;
  page?: string;
  limit?: string;
}

export const createSubTypes = async (req: Request, res: Response) => {
  const data = JSON.parse(req.body.data);
  const file = req.file;
  if (!file) {
    const type = await Subscription_Type.create(data);
    return res
      .status(200)
      .json({ message: "Subscription type created successfully", type });
  }
  const key = await uploadDocument(
    "type", // Use a generic name or fetch the type name dynamically
    data.sub_type, // Use typeId as clientId
    "image", // Use a fixed subscriptionId or dynamic value
    file.originalname,
    file.buffer,
    file.mimetype
  );
  const imageUrl = `https://blitzvox-bucket.s3.amazonaws.com/${key}`;
  try {
    const type = await Subscription_Type.create({
      ...data,
      sub_image: imageUrl,
    });
    res
      .status(200)
      .json({ message: "Subscription type created successfully", type });
  } catch (error) {
    res.status(500).json({ message: "Something went Wrong" });
  }
};
export const getSubTypes = async (
  req: Request<{}, {}, {}, UserQueryParams>,
  res: Response
) => {
  const keys = Object.keys(req.query);
  const { page = "1", limit = "10" } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  const where: WhereOptions<InferAttributes<Subscription_Type>> = {};
  if (keys.length > 2) {
    (where as any)[Op.or] = [
      { [keys[2]]: { [Op.iLike]: `%${(req as any).query[keys[2]]}%` } },
    ];
  }
  const types = await Subscription_Type.findAll({
    where: where,
    limit: limitNum,
    offset: (pageNum - 1) * limitNum,
  });

  if (!types) {
    return res.status(404).json({ message: "No Types found" });
  }
  const totalCount = await Subscription_Type.count({ where: where });

  res.status(200).json({
    message: "Types fetched Succeffully",
    types,
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
export const deleteSubType = async (req: Request, res: Response) => {
  const { id } = req.params;

  const type = await Subscription_Type.findByPk(id);
  if (!type) {
    return res.status(404).json({ message: "No Subscription Found " });
  }
  try {
    await type.destroy();
    res.status(200).json({ message: "Subsctiption Type Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const getSubTypeById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const type = await Subscription_Type.findByPk(id);
  if (!type) {
    return res.status(404).json({ message: "No Subscription Found " });
  }
  try {
    return res.status(200).json({ message: "No Subscription Found ", type });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateSubTypes = async (req: Request, res: Response) => {
  const data = req.body;
  const { id } = req.params;
  const file = req.file;
  let imageUrl;
  if (file) {
    const key = await uploadDocument(
      "type", // Use a generic name or fetch the type name dynamically
      data.sub_type, // Use typeId as clientId
      "image", // Use a fixed subscriptionId or dynamic value
      file.originalname,
      file.buffer,
      file.mimetype
    );
    imageUrl = `https://blitzvox-bucket.s3.amazonaws.com/${key}`;
  }
  try {
    let type = await Subscription_Type.findByPk(id);
    if (!type) {
      return res
        .status(404)
        .json({ message: "No Subscription type Found successfully" });
    }
    type.sub_type = data.sub_type;
    type.sub_image = imageUrl || type.sub_image;
    type?.save();
    res
      .status(200)
      .json({ message: "Subscription type Updated successfully", type });
  } catch (error) {
    res.status(500).json({ message: "Something went Wrong" });
  }
};
