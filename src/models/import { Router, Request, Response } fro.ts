import { Router, Request, Response } from "express";
import { Types } from "mongoose";
import { Server } from "socket.io";
import { IMessageDocument, Message } from "../models/ChatMessages.model";

const router: Router = Router();

export const getChats = async (req: Request, res: Response) => {
  try {
    const { fromUserId, toUserId } = req.body;
    const messages: IMessageDocument[] = await Message.find({
      $or: [
        { from: fromUserId, to: toUserId },
        { from: toUserId, to: fromUserId },
      ],
    })
      .populate("from", "username")
      .populate("to", "username")
      .sort("createdAt");
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addChatsController = async (req: Request, res: Response) => {
  try {
    const { fromUserId, toUserId, text } = req.body;
    const message = new Message({ from: fromUserId, to: toUserId, text });
    await message.save();
    res.json(message);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const handleSocketAddMessages = async (
  io: Server,
  payload: { fromUserId: string; toUserId: string; text: string }
): Promise<void> => {
  try {
    const { fromUserId, toUserId, text } = payload;
    const message = new Message({ from: fromUserId, to: toUserId, text });
    await message.save();
    io.to(toUserId).to(fromUserId).emit("message", message);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
