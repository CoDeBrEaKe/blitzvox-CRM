import { Request, Response } from "express";
import Subscription_Type from "../models/Subscription_Type";

export const createSubTypes = async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const type = await Subscription_Type.create(data);
    res
      .status(200)
      .json({ message: "Subscription type created successfully", type });
  } catch (error) {
    res.status(500).json({ message: "Something went Wrong" });
  }
};
export const getSubTypes = async (req: Request, res: Response) => {
  const types = await Subscription_Type.findAll();

  if (!types) {
    return res.status(404).json({ message: "No Types found" });
  }
  res.status(200).json({ message: "Types fetched Succeffully", types });
};
export const deleteSubType = async (req: Request, res: Response) => {
  const { id } = req.params;

  const type = await Subscription_Type.findByPk(id);
  if (!type) {
    return res.status(404).json({ message: "No Subscription Found " });
  }
  try {
    await type.destroy();
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
    return res.status(404).json({ message: "No Subscription Found ", type });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateSubTypes = async (req: Request, res: Response) => {
  const data = req.body;
  const { id } = req.params;
  try {
    let type = await Subscription_Type.findByPk(id);
    if (!type) {
      return res
        .status(404)
        .json({ message: "No Subscription type Found successfully" });
    }
    type = await type.update(data);
    res
      .status(200)
      .json({ message: "Subscription type Updated successfully", type });
  } catch (error) {
    res.status(500).json({ message: "Something went Wrong" });
  }
};
