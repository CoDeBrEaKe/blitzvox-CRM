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
// export const createSubType = async (req: Request, res: Response) => {};
// export const createSubType = async (req: Request, res: Response) => {};
