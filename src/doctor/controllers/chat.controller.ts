import chatRoom from '../modal/chatRoom.model';
import ChatModel from '../modal/chat.model';
import { getIo } from '../../utils/chatSocket';
import PharmModel from '../../user/models/userReg.model'
import DoctorModel from '../../doctor/modal/doctor_reg.modal';
import AdminModel from '../../admin/models/admin_reg.model';
import { Request, Response } from "express";



// CREATE A CHAT ROOM BETWEEN PRACTICE DOC AND ADMIN DOCTOR
export const createChatRoom = async (req:any, res:Response) => {
    try {
      const doctor_id = req.doctor._id;
      console.log("current doc: ", doctor_id)
      const current_doctor = req.doctor;
      const { name, secondary_doctor } = req.body;

      if(!name){
        return res.status(400).json({ error: 'room name is required' });
      }

      if(!secondary_doctor){
        return res.status(400).json({ error: 'secondary doctor id is required' });
      }

      let newRoom;

      // check if current doctor is super doctor...
      if(current_doctor.superDoctor){
        const existingRoom = await chatRoom.findOne({ name, adminDoctor: doctor_id, practiceDoctor: secondary_doctor });

        if (existingRoom) {
          return res.status(200).json({ error: 'room already exists' });
        }
        // ....
        newRoom = new chatRoom({
          name,
          adminDoctor: doctor_id,
          practiceDoctor: secondary_doctor,
        });
        await newRoom.save()
      } else {
        const existingRoom = await chatRoom.findOne({ name, adminDoctor: secondary_doctor, practiceDoctor: doctor_id });

        if (existingRoom) {
          return res.status(200).json({ error: 'room already exists' });
        }

        // ....
        newRoom = new chatRoom({
          name,
          adminDoctor: secondary_doctor,
          practiceDoctor: doctor_id,
        });

        await newRoom.save();
      }

      res.status(201).json({ message: "new chat room created successfully", newRoom });
      console.log("new message room created");
    } catch (error) {
      res.status(500).json({ message: 'Unable to create chat room', error });
      console.log("error creating rooom: ", error);
    }
};


// GET ALL CHATS ROOMS FOR DOC >>>
export const getChatRooms = async (req:any, res:Response) => {
    try{
        // const doctor_id = req.params.doctor_id;
        const doctor_id = req.doctor._id

       
       
        const doctor:any = await DoctorModel.findById(doctor_id);
        // const practiceDoctor = await DoctorModel.findById(doctor_id)

        if(doctor.superDoctor){
            const rooms = await chatRoom.find({ adminDoctor: doctor_id }).populate({
                path: "practiceDoctor",
                // select: "firstName lastName email phoneNumber title organization speciality"
            });
            return res.status(200).json({ rooms })
        } else {
          const rooms = await chatRoom.find({ practiceDoctor: doctor_id }).populate({
              path: "adminDoctor",
              // select: "firstName lastName email phoneNumber title organization speciality"
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
    const userId = req.doctor.id
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
