import { Request, Response, Express } from "express";
import User from "../models/User";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.findAll();
  if (!users) {
    return res.status(500).json({ messgae: "Something Wrong Happened" });
  }
  res.status(200).json({ message: "Users fetched successfully", users });
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
  res.cookie("token", generateToken(user), {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // set to true in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // set to 'none' in production
  });
  res.status(200).json({ message: "Login Successful", user });
};

export const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out fetched successfully" });
};
