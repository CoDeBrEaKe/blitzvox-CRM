import { Request, Response } from "express";
import Client_Sub from "../models/Client_Sub";

export const getClientSubscribtions = async (req: Request, res: Response) => {
  const clientSubs = await Client_Sub.findAll();
  if (!clientSubs) {
    return res
      .status(404)
      .json({ message: "No Subscribtions for this client yet" });
  }
  res
    .status(200)
    .json({ message: "No Subscribtions for this client yet", clientSubs });
};

export const getSingleClientSubscribtion = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const clientSub = await Client_Sub.findByPk(id);
  if (!clientSub) {
    return res.status(404).json({ message: "No Subscribtion found" });
  }
  res
    .status(200)
    .json({ message: "No Subscribtions for this client yet", clientSub });
};

export const createClientSub = async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const clientSub = await Client_Sub.create(data);
    res
      .status(201)
      .json({ message: "Subscribtion created successfully", clientSub });
  } catch (error) {
    res.status(500).json({ message: "Something went Wrong" });
  }
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
    res.status(200).json({ message: "Subscribtion deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went Wrong" });
  }
};
