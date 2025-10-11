import { Request, Response, Express } from "express";
import User from "../models/User";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { InferAttributes, WhereOptions } from "sequelize";
import { Op } from "sequelize";
interface UserQueryParams {
  name?: string;
  username?: string;
  role?: string;
  page?: string;
  limit?: string;
}

export const getUsers = async (
  req: Request<{}, {}, {}, UserQueryParams>,
  res: Response
) => {
  const keys = Object.keys(req.query);
  const { page = "1", limit = "10" } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  const key = keys[2];
  const value = (req.query as any)[key];
  const where: WhereOptions<InferAttributes<User>> = {};

  if (keys.length > 2) {
    if (key === "role") {
      (where as any)[key] = value; // exact match
    } else {
      (where as any)[Op.or] = [{ [key]: { [Op.iLike]: `%${value}%` } }];
    }
  }
  const users = await User.findAll({
    where: where,
    limit: limitNum,
    offset: (pageNum - 1) * limitNum,
  });
  if (!users) {
    return res.status(500).json({ messgae: "Something Wrong Happened" });
  }
  const totalCount = await User.count({ where: where });

  res.status(200).json({
    message: "Users fetched successfully",
    users,
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
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ message: "No User Found " });
  }
  try {
    return res.status(200).json({ message: "user fetched Found ", user });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const addUser = async (req: Request, res: Response) => {
  const userData = req.body;

  const hashedPassword = await hashPassword(userData.password);
  userData.password = hashedPassword;

  const user = await User.create(userData);
  if (!user) {
    return res.status(500).json({ messgae: "Something Wrong Happened" });
  }
  res.status(200).json({ message: "Users fetched successfully", user });
};

export const loginUser = async (req: Request, res: Response) => {
  const credintials = req.body;

  const user = await User.findOne({
    where: { username: credintials.username },
  });
  if (!user) {
    return res.status(401).json({ messsage: "Invalid Username" });
  }
  const check = await comparePassword(credintials.password, user.password);

  if (!check) {
    return res.status(401).json({ messsage: "Invalid Username" });
  }
  res.cookie("token", generateToken({ ...user }), {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: false,
    secure: true, // set to true in production
    sameSite: "none", // set to 'none' in production
  });
  res.status(200).json({ message: "Login Successful", user });
};

export const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out fetched successfully" });
};

export const me = async (req: Request, res: Response) => {
  const user = await (req as any).user;
  return res.status(200).json({ user });
};
