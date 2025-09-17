import { Request, Response } from "express";
import Email from "../models/Email";
import { MessageFactory } from "../services/messageService";

export const createEmail = async (req: Request, res: Response) => {
  let { subject, content } = req.body;
  try {
    const newEmail = await Email.create({ subject, content });
    return res
      .status(201)
      .json({ message: "Email Template Created", email: newEmail });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating email template", error });
  }
};

export const getEmails = async (req: Request, res: Response) => {
  try {
    const emails = await Email.findAll();
    if (!emails) {
      return res.status(404).json({ message: "No email templates found" });
    }
    res.json({ message: "Email templates fetched successfully", emails });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching email templates", error });
  }
};

export const getEmailById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const email = await Email.findByPk(id);
    if (!email) {
      return res.status(404).json({ message: "Email template not found" });
    }
    return res
      .status(200)
      .json({ message: "Email template fetched successfully", email });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching email template", error });
  }
};

export const updateEmail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { subject, content } = req.body;
  try {
    const email = await Email.findByPk(id);
    if (!email) {
      return res.status(404).json({ message: "Email template not found" });
    }
    email.subject = subject || email.subject;
    email.content = content || email.content;
    await email.save();
    return res
      .status(200)
      .json({ message: "Email template updated successfully", email });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating email template", error });
  }
};

export const deleteEmail = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const email = await Email.findByPk(id);
    if (!email) {
      return res.status(404).json({ message: "Email template not found" });
    }
    await email.destroy();
    return res
      .status(200)
      .json({ message: "Email template deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting email template", error });
  }
};

export const sendEmail = async (req: Request, res: Response) => {
  const { subject, content, to } = req.body;
  try {
    await MessageFactory.getMessageService("EMAIL").sendMessage(
      subject,
      content,
      to
    );
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error sending email", error });
  }
};
