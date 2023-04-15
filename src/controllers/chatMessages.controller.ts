import { Request, Response } from "express";
import Chat from "../models/ChatMessages.model";

export const getChatsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.body;

    // Find all chats involving user
    const chats = await Chat.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "-password")
      .populate("receiver", "-password")
      .sort({ createdAt: -1 });

    res.status(200).json({ chats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendChatController = async (req: Request, res: Response) => {
  try {
    const { sender, receiver, message } = req.body;

    // Create new chat
    const chat = new Chat({
      sender,
      receiver,
      message,
    });
    await chat.save();

    return res.status(201).json({ message: "Chat sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
