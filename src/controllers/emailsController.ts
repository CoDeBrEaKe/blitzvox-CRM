import { Request, Response } from "express";
import Email from "../models/Email";
import { MessageFactory } from "../services/messageService";
import { InferAttributes, WhereOptions } from "sequelize";
import { Op } from "sequelize";

interface UserQueryParams {
  subject?: string;
  content?: string;
  page?: string;
  limit?: string;
}

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

export const getEmails = async (
  req: Request<{}, {}, {}, UserQueryParams>,
  res: Response
) => {
  const keys = Object.keys(req.query);
  const { page = "1", limit = "10" } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  const key = keys[2];
  const value = (req.query as any)[key];
  const where: WhereOptions<InferAttributes<Email>> = {};

  if (keys.length > 2) {
    (where as any)[Op.or] = [{ [key]: { [Op.iLike]: `%${value}%` } }];
  }
  try {
    const emails = await Email.findAll({
      where: where,
      limit: limitNum,
      offset: (pageNum - 1) * limitNum,
    });
    const totalCount = await Email.count({ where: where });
    if (!emails) {
      return res.status(404).json({ message: "No email templates found" });
    }
    res.json({
      message: "Email templates fetched successfully",
      emails,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalItems: totalCount,
        itemsPerPage: limitNum,
        hasNext: pageNum * limitNum < totalCount,
        hasPrev: pageNum > 1,
      },
    });
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
