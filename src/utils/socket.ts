import { Server, Socket } from "socket.io";
import User from "../models/User.model";
import Chat from "../models/ChatMessages.model";

export const socket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", async (socket: Socket) => {
    const { userId } = socket.handshake.query;

    // Find user by ID
    const user = await User.findById(userId);

    if (!user) return;

    if (user.role === "admin") {
      // Admin joins all rooms
      const users = await User.find({ role: "user" });
      // TODO return those who have chatted admin
      // for (const user of users) {
      //   socket.join(user.id);
      // }
    } else {
      // User joins room with admin
      const admins = await User.find({ role: "admin" });

      for (const admin of admins) {
        socket.join(admin.id);
      }
    }

    // Listen for incoming chats
    socket.on("chat", async ({ sender, receiver, message }) => {
      try {
        // Save chat to database
        const chat = new Chat({
          sender,
          receiver,
          message,
        });
        await chat.save();

        // Emit chat to all sockets in the room
        socket.to(receiver).emit("chat", chat);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("leave", (userId: string) => {
      socket.leave(userId);
      console.log(`User ${userId} left`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

export default socket;
