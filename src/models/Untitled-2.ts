import { Server, Socket } from "socket.io";
import { handleSocketAddMessages } from "../controllers/chatMessages.controller";


const handleSocketConnection = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("New client connected");

    socket.on("join", (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined`);
    });

    socket.on("leave", (userId: string) => {
      socket.leave(userId);
      console.log(`User ${userId} left`);
    });

    socket.on(
      "message",
      (payload: { fromUserId: string; toUserId: string; text: string }) => {
        handleSocketAddMessages(io, payload);
      }
    );
    

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

export default handleSocketConnection;
