import { Express, Request, Response } from "express";
import Client from "../models/Client";
import Subscription from "../models/Subscription";
import User from "../models/User";
import { Sequelize } from "sequelize";
export const getReports = async (req: Request, res: Response) => {
  try {
    // Total counts
    const totalClients = await Client.count();
    const totalSubscriptions = await Subscription.count();
    const totalUsers = await User.count();

    // Top cities (group by city)
    const cityStats = await Client.findAll({
      attributes: [
        "city",
        [Sequelize.fn("COUNT", Sequelize.col("city")), "clients"],
      ],
      group: ["city"],
      order: [[Sequelize.literal("clients"), "DESC"]],
      limit: 7,
      raw: true,
    });

    res.status(200).json({
      totalClients,
      totalSubscriptions,
      totalUsers,
      topCities: cityStats,
    });
  } catch (error) {
    console.error("Error in dashboard report:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
