import chatRoom from '../models/chatRoom.model';
import ChatModel from '../models/chat.model';
import { getIo } from '../../utils/chatSocket';
import PharmModel from '../../user/models/userReg.model'
import DoctorModel from '../../doctor/modal/doctor_reg.modal';
import AdminModel from '../../admin/models/admin_reg.model';
import { Request, Response } from "express";



// CREATE A CHAT ROOM BETWEEN PHARM AND DOCTOR
export const createChatRoom = async (req:any, res:Response) => {
    try {
      const { name, pharm_id, doctor_id } = req.body;

      if(!name){
        return res.status(400).json({ error: 'room name is required' });
      }

      if(!pharm_id){
        return res.status(400).json({ error: 'pharmacy id is required' });
      }

      if(!doctor_id){
        return res.status(400).json({ error: 'doctor id is required' });
      }

      // Check if the room already exists
      const existingRoom = await chatRoom.findOne({ name, pharm: pharm_id, doctor: doctor_id });

      if (existingRoom) {
        return res.status(400).json({ error: 'room already exists' });
      }

      // Create a new room and store references to the user and employer
      const room = new chatRoom({ name, pharm: pharm_id, doctor: doctor_id });
      await room.save();

      res.status(201).json({ room });
      console.log("new message room created");
    } catch (error) {
      res.status(500).json({ message: 'Unable to create chat room', error });
      console.log("error creating rooom: ", error);
    }
};


// GET ALL CHATS ROOMS FOR A USER >>>
export const getChatRooms = async (req:any, res:Response) => {
    try{
        // const user_id = req.params.user_id;
        const user_id = req.admin.id

        console.log("from request: ", req.admin)
        // const user = req.user;
        // console.log("user in request payload: ", user.email)
        if(!user_id){
            return res.status(400).json({ message: "user_id is missing in url params"})
        }
        const pharm = await AdminModel.findById(user_id);
        const doctor = await DoctorModel.findById(user_id)

        console.log("..", pharm, doctor)

        if(!pharm && !doctor){
            return res.status(404).json({ message: "user not found"})
        }

        if(pharm){
            const rooms = await chatRoom.find({ pharm }).populate({
                path: "doctor",
                select: "firstName lastName email phoneNumber title organization speciality"
            });
            return res.status(200).json({ rooms })
        }
        if(doctor){
            const rooms = await chatRoom.find({ doctor }).populate({
                path: "pharm",
                select: "firstName lastName email phoneNumber"
            });
            return res.status(200).json({ rooms })
        }
       
        
    }catch(error){
        res.status(500).json({ error: 'unable to fetch rooms' });
        console.log('error getting user rooms: ', error);
    }
}


// GET MESSAGES IN A PARTICULAR ROOM >>>
export const getChatsInRoom = async (req:any, res:Response) => {
    try {
      const room_id = req.params.room_id;
      const messages = await ChatModel.find({ room: room_id });
      res.status(200).json({ messages });
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch messages from room' });
      console.log("error getting messages for room: ", error);
    }
};


// SEND MESSAGE CONTROLLER >>>
export const sendChatToRoom = async (req:any, res:Response) => {
    try {
    const userId = req.admin.id
    const roomId = req.params.room_id;
    const { text } = req.body;

    if(!text){
      return res.status(400).json({ message: "please input a message text!"})
    }

    const room = await chatRoom.findById(roomId);
    if(!room){
      return res.status(400).json({ message: "chat not sent, room not found"})
    }
    const today = Date.now();

    // Create a new message
    const message = await ChatModel.create({ text, user: userId, room: roomId });

    room.updatedAt = today;
    console.log("room date updated!!!")

    await room.save();

    const io = getIo();
    // Emit the message to the room using Socket.io
    io.to(roomId).emit('message', message);
    console.log("msg sent to room: ", roomId, text);

    res.status(201).json({ message });
    } catch (error) {
      console.error('Error sending message:', error); // Log the error
      res.status(500).json({ error: 'Unable to send message' });
    }
};
