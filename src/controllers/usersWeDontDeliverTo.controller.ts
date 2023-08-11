import { Request, Response } from "express";
import UsersWeDontDeliverTo from "../models/UsersWeDontDeliverTo.model";

// Create a new user entry
export const addUsersWeDontDeliverToController = async (
  req: Request,
  res: Response
) => {
  const { email, address, state } = req.body;

  try {
    const user = await UsersWeDontDeliverTo.create({ email, address, state });
    res.status(201).json({ message: "Information Saved Successfully", user });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to retrieve users", error: error.message });
  }
};

// Get all user entries
export const getUsersWeDontDeliverToController = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await UsersWeDontDeliverTo.find();
    res
      .status(200)
      .json({ message: "Information Retrieved Successfully", users });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to retrieve users", error: error.message });
  }
};

// Find a user entry by ID
export const getUsersWeDontDeliverToByIdController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  try {
    const user = await UsersWeDontDeliverTo.findById(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      res
        .status(200)
        .json({ message: "Information Retrieved Successfully", user });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to retrieve users", error: error.message });
  }
};
