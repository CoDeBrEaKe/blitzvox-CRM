import e, { Request, Response } from "express";
import Feedback from "../models/Feedback";

export const createFeedback = async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const newFeedback = await Feedback.create(data);
    return res
      .status(201)
      .json({ message: "Feedback created", feedback: newFeedback });
  } catch (error) {
    return res.status(500).json({ message: "Error creating feedback", error });
  }
};

export const updateFeedback = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const feedback = await Feedback.findByPk(id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    await feedback.update(updateData);
    return res
      .status(200)
      .json({ message: "Feedback updated", feedback: feedback });
  } catch (error) {
    return res.status(500).json({ message: "Error updating feedback", error });
  }
};

export const deleteFeedback = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const feedback = await Feedback.findByPk(id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    await feedback.destroy();
    return res.status(200).json({ message: "Feedback Deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Something wrong happened" });
  }
};

export const getFeedbacks = async (req: Request, res: Response) => {
  const { id, client } = req.params;
  try {
    const feedbacks = await Feedback.findAll({
      where: client === "client" ? { client_id: id } : { client_sub_id: id },
      order: [["created_at", "DESC"]],
    });
    if (!feedbacks) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    return res.status(200).json({ feedbacks });
  } catch (error) {
    return res.status(500).json({ message: "Something wrong happened" });
  }
};
