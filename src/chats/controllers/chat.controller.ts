import chatRoom from '../model/chat.room.model';

import ChatModel from '../model/chat.model';
import AdminChatModel from '../../admin/models/chat.model';

import { getIo } from '../../utils/chatSocket';
import PharmModel from '../../user/models/userReg.model'
import DoctorModel from '../../doctor/modal/doctor_reg.modal';
import AdminModel from '../../admin/models/admin_reg.model';
import { Request, Response } from "express";
import path from 'path';
import DoctotModel from '../../doctor/modal/doctor_reg.modal';
import UserModel from '../../user/models/userReg.model';

// chats here can be between
// doctors and fellow doctors..
// doctors and pharmacies...
// pharmacies and patients...
export const createChatRoom = async (req: any, res: Response) => {
  try {
    const { name, doctor, pharmacy, patient } = req.body;
    const doctor_id = req.doctor?._id || null;
    const admin_id = req.admin?.id || null;
    const patient_id = req.user?.id || null;

    if (!name) {
      return res.status(400).json({ error: 'Room name is required' });
    }

    if (!doctor && !pharmacy && !patient) {
      return res.status(400).json({ error: 'A doctor, pharmacy, or patient is required to create a chat room' });
    }

    let new_chat_room;
    let owner, ownerModel;

     // check if room is already exisiting...
     const existingRoom = await chatRoom.findOne({
          name,
          owner: doctor_id || admin_id || patient_id,
          doctor: doctor_id || null,
          pharmacy: pharmacy || null,
          patient: patient_id || null
      }).populate({
          path: "doctor",
          select: "firstName lastName email"
      }).populate({
          path: "pharmacy",
          select: "firstName lastName email"
      }).populate({
          path: "patient",
          select: "firstName lastName email"
      });

      if (existingRoom) {
        return res.status(200).json({ message: 'room already exists', room: existingRoom });
      }

    if (doctor_id && doctor) {
      owner = doctor_id;
      ownerModel = "DoctorReg";
      new_chat_room = new chatRoom({
        name,
        owner,
        ownerModel,
        doctor
      });
    } else if (doctor_id && pharmacy) {
      owner = doctor_id;
      ownerModel = "DoctorReg";
      new_chat_room = new chatRoom({
        name,
        owner,
        ownerModel,
        pharmacy
      });
    } else if (admin_id && doctor) {
      owner = admin_id;
      ownerModel = "AdminReg";
      new_chat_room = new chatRoom({
        name,
        owner,
        ownerModel,
        doctor
      });
    } else if (patient_id && pharmacy) {
      owner = patient_id;
      ownerModel = "UserReg";
      new_chat_room = new chatRoom({
        name,
        owner,
        ownerModel,
        pharmacy
      });
    } else if (admin_id && patient) {
      owner = admin_id;
      ownerModel = "AdminReg";
      new_chat_room = new chatRoom({
        name,
        owner,
        ownerModel,
        patient
      });
    } else {
      return res.status(400).json({ error: 'Invalid request to create a chat room' });
    }

    await new_chat_room.save();
    res.status(201).json({ message: "New chat room created successfully", new_chat_room });
    console.log("New chat room created");
  } catch (error) {
    res.status(500).json({ message: 'Unable to create chat room', error });
    console.log("Error creating room: ", error);
  }
};




// getting chat rooms...
export const getChatRooms = async (req: any, res: Response) => {
  try {
      const doctor_id = req.doctor?._id;
      const admin_id = req.admin?.id;
      const patient_id = req.user?.id;

      console.log("user making request: ", doctor_id || admin_id || patient_id);

      const ownerIds = [doctor_id, admin_id, patient_id].filter(Boolean);
      
      // Build the query object dynamically based on available IDs
     /*  const query: any = {
          $or: [
              { owner: { $in: ownerIds } },
              doctor_id ? { doctor: doctor_id } : null,
              admin_id ? { pharmacy: admin_id } : null,
              patient_id ? { patient: patient_id } : null
          ].filter(Boolean)
      };
 */
      const queryConditions = [
        { owner: { $in: ownerIds } },
        doctor_id && { doctor: doctor_id },
        admin_id && { pharmacy: admin_id },
        patient_id && { patient: patient_id }
    ].filter(Boolean);
    
    const query = { $or: queryConditions };
    

      // Find and populate rooms
      const rooms = await chatRoom.find(query)
          .populate({
              path: "doctor",
              select: "firstName lastName email"
          })
          .populate({
              path: "pharmacy",
              select: "firstName lastName email"
          })
          .populate({
              path: "patient",
              select: "firstName lastName email"
          });

      return res.status(200).json({ success: true, rooms });

  } catch (error) {
      res.status(500).json({ error: 'Unable to fetch rooms' });
      console.log('Error getting user rooms: ', error);
  }
};




// GET MESSAGES IN A PARTICULAR ROOM >>>
export const getChatsInRoom = async (req: any, res: Response) => {
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
    const userId = req.doctor?._id || req.admin?._id || req.user?._id;
    const roomId = req.params.room_id;
    const { text } = req.body;

    if(!text){
      return res.status(400).json({ message: "please input a message text!"})
    }

    const room = await chatRoom.findById(roomId);
    if(!room){
      return res.status(400).json({ message: "chat not sent, invalid room ID"})
    }
    const today = Date.now();

    // Create a new message
    const message = await ChatModel.create({ text, user: userId, room: roomId });

    const [doctor, admin, user] = await Promise.all([
        DoctorModel.findById(userId),
        AdminModel.findById(userId),
        UserModel.findById(userId)
    ]);
    
    const message_sender = doctor || admin || user;
    

    room.updatedAt = today;
    room.last_message.sender_name = `${message_sender?.firstName} ${message_sender?.lastName}`;
    room.last_message.text = text;
    console.log("room date updated!!!")

    await room.save();

    const io = getIo();
    // Emit the message to the room using Socket.io
    io.to(roomId).emit('message', message);
    console.log("msg sent to room: ", roomId, text);

    res.status(201).json({ message: "message sent successfully", data: message });
    } catch (error) {
      console.error('Error sending message:', error); // Log the error
      res.status(500).json({ error: 'Unable to send message' });
    }
};
