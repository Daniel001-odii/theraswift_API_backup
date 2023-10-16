import { Server, Socket } from 'socket.io';
import Chat from "../models/chat.model";
import User from '../models/userReg.model';
import Admin from "../../admin/models/admin_reg.model"

interface Join {
    userId: string;
}

interface AdminJoin {
    userId: string;
    AdminId: string;
}

export default (io: Server) => {

  io.on('connection', (socket: Socket) => {

    socket.on('join', async (join: Join) => {
      
      //socket.join(userId);

      // Get chats involving the user
      const chats = await Chat.find({
        $or: [{ sender: join.userId }, { reciever: join.userId }],
      })
        .sort({ createdAt: 1 });

      // Emit the chats to the user
      socket.emit('chats', { chats });
    });

    socket.on('getUsersChattedAdmin', async (join: AdminJoin) => {
      //const userChat = await User.find({ 'chats.adminId': adminId }).select('_id email');

      const userChat = await Chat.find({
        $or: [{ sender: join.userId }, { reciever: join.userId }],
      })
        .sort({ createdAt: 1 });

      socket.emit('usersChattedAdmin', { userChat });
    });

    socket.on('new_message', async ({ sender, receiver = '7053578760', message }: { sender: string, receiver: string, message: string }) => {
      try {
        // Create new chat
        const chat = new Chat({
          sender,
          reciever: receiver,
          message,
        });

        await chat.save();

        let newMessage = {
          sender:chat.sender,
          receiver:chat.reciever,
          message: chat.message,
          time: chat.createdAt
          // type: chat.sender === userId ? 'send' | 'recieve'
        }

        // Emit the message to the receiver
        io.to(receiver).emit('new_message', newMessage);

        // Send success status to the sender
        socket.emit('messageStatus', { success: true });
      } catch (error) {
        console.error(error);

        // Send error status to the sender
        socket.emit('messageStatus', { success: false });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};
