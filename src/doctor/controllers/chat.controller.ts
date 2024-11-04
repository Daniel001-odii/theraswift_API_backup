import chatRoom from '../modal/chatRoom.model';

import ChatModel from '../modal/chat.model';
import AdminChatModel from '../../admin/models/chat.model';

import { getIo } from '../../utils/chatSocket';
import PharmModel from '../../user/models/userReg.model'
import DoctorModel from '../../doctor/modal/doctor_reg.modal';
import AdminModel from '../../admin/models/admin_reg.model';
import { Request, Response } from "express";
import path from 'path';
import DoctotModel from '../../doctor/modal/doctor_reg.modal';


/* // create chat room between two doctors or doctors and pharmacy..
export const createChatRoom = async (req: any, res: Response) => {
  try {
    const doctor_id = req.doctor._id;
    console.log("current doc: ", doctor_id);
    const current_doctor = req.doctor;
    const { name, secondary_doctor, pharmacy } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Room name is required' });
    }

    if (!secondary_doctor && !pharmacy) {
      return res.status(400).json({ error: 'Either a secondary doctor or a pharmacy is required to initiate a chat room' });
    }

    let newRoom;

    // Check if current doctor is a super doctor
    if (current_doctor.superDoctor) {
      const existingRoom = await chatRoom.findOne({
        name,
        doctor_1: doctor_id,
        doctor_2: secondary_doctor || null,
        pharmacy: pharmacy || null,
      });

      if (existingRoom) {
        return res.status(200).json({ error: 'Room already exists' });
      }

      newRoom = new chatRoom({
        name,
        doctor_1: doctor_id,
        doctor_2: secondary_doctor || null,
        pharmacy: pharmacy || null,
      });
    } else {
      const existingRoom = await chatRoom.findOne({
        name,
        doctor_1: secondary_doctor || null,
        doctor_2: doctor_id,
        pharmacy: pharmacy || null,
      });

      if (existingRoom) {
        return res.status(200).json({ error: 'Room already exists' });
      }

      newRoom = new chatRoom({
        name,
        doctor_1: secondary_doctor || null,
        doctor_2: doctor_id,
        pharmacy: pharmacy || null,
      });
    }

    await newRoom.save();
    res.status(201).json({ message: "New chat room created successfully", newRoom });
    console.log("New message room created");
  } catch (error) {
    res.status(500).json({ message: 'Unable to create chat room', error });
    console.log("Error creating room: ", error);
  }
}; */


export const createChatRoom = async (req: any, res: Response) => {
  try {
    const doctor_id = req.doctor._id;
    console.log("current doc: ", doctor_id);

    const owner = req.doctor;
    const { name, doctor, pharmacy } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'room name is required' });
    }

    if (!doctor && !pharmacy) {
      return res.status(400).json({ error: 'Either a secondary doctor or a pharmacy is required to initiate a chat room' });
    }

    // check if room is already exisiting...
    const existingRoom = await chatRoom.findOne({
      name,
      owner: doctor_id,
      doctor: doctor || null,
      pharmacy: pharmacy || null,
    }).populate({
      path: "doctor",
      select: "firstName lastName email"
    }).populate({
      path: "pharmacy",
      select: "firstName lastName email"
    });

    if (existingRoom) {
      return res.status(200).json({ message: 'room already exists', room: existingRoom });
    }

    let new_chat_room;

    // if doctor is provided, create new chat room b/w doctors...
    if(doctor){
      new_chat_room = new chatRoom({
        name,
        owner,
        doctor
      });

    } else if(pharmacy){
      new_chat_room = new chatRoom({
        name,
        owner,
        pharmacy
      });
    };
    

    await new_chat_room.save();
    res.status(201).json({ message: "New chat room created successfully", new_chat_room });
    console.log("New message room created");
  } catch (error) {
    res.status(500).json({ message: 'Unable to create chat room', error });
    console.log("Error creating room: ", error);
  }
};


// GET ALL CHATS ROOMS FOR DOC >>>
/* export const getChatRooms = async (req:any, res:Response) => {
    try{
        // const doctor_id = req.params.doctor_id;
        const doctor_id = req.doctor._id

        const doctor:any = await DoctorModel.findById(doctor_id);
        // const practiceDoctor = await DoctorModel.findById(doctor_id)

        if(doctor.superDoctor){
            const rooms = await chatRoom.find({ doctor_1: doctor_id }).populate({
                path: "doctor_2",
                // select: "firstName lastName email phoneNumber title organization speciality"
            }).populate("pharmacy");
            return res.status(200).json({ rooms })
        } else {
          const rooms = await chatRoom.find({ doctor_2: doctor_id }).populate({
              path: "doctor_1",
              // select: "firstName lastName email phoneNumber title organization speciality"
          }).populate("pharmacy");
          return res.status(200).json({ rooms })
        }
        
    }catch(error){
        res.status(500).json({ error: 'unable to fetch rooms' });
        console.log('error getting user rooms: ', error);
    }
}
 */

export const getChatRooms = async (req:any, res:Response) => {
    try{
        // const doctor_id = req.params.doctor_id;
        const doctor_id = req.doctor._id

        const doctor:any = await DoctorModel.findById(doctor_id);
        const rooms = await chatRoom.find({ owner: doctor_id }).populate({
          path: "doctor",
          select: "firstName lastName email"
        }).populate({
          path: "pharmacy",
          select: "firstName lastName email"
        });

        return res.status(200).json({ success: true, rooms });
        
    }catch(error){
        res.status(500).json({ error: 'unable to fetch rooms' });
        console.log('error getting user rooms: ', error);
    }
}


// GET MESSAGES IN A PARTICULAR ROOM >>>
export const getChatsInRoom = async (req: any, res: Response) => {
  try {
      const room_id = req.params.room_id;
      const messages = await ChatModel.find({ room: room_id });
      const admin_messages = await AdminChatModel.find({ room: room_id });

      // Combine both arrays into a single array of messages
      const all_messages = [...messages, ...admin_messages];

      res.status(200).json({ messages: all_messages });
  } catch (error) {
      res.status(500).json({ error: 'Unable to fetch messages from room' });
      console.log("error getting messages for room: ", error);
  }
};


// SEND MESSAGE CONTROLLER >>>
export const sendChatToRoom = async (req:any, res:Response) => {
    try {
    const userId = req.doctor._id
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

    const message_sender = await DoctotModel.findById(userId);

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
