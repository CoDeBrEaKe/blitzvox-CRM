import e, { Request, Response } from "express";
import Subscription from "../models/Subscription";

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
  try {
    const subscription = await Subscription.findByPk(id);
    if (!subscription) {
      return res.status(404).json({ message: "subscription not found" });
    }
    await subscription.destroy();
    return res.status(200).json({ message: "subscription Deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Something wrong happened" });
  }
};

export const getSubscriptions = async (req: Request, res: Response) => {
  try {
    const subscriptions = await Subscription.findAll();
    if (!subscriptions) {
      return res.status(404).json({ message: "No subscriptions found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching subscriptions", error });
  }
};

export const getSubscriptionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const subscription = await Subscription.findByPk(id);
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
