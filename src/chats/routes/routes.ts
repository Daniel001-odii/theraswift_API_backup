const express = require("express");
const router = express.Router();

import { checkUserRole } from "../../user/middlewares/roleChecker.middleware";

import { checkAdminRole } from "../../admin/middleware/rolechecker.middleware";

import { checkDoctorRole } from "../../doctor/middleware/rolechecke.middleware";

import { createChatRoom, getChatRooms, getChatsInRoom, sendChatToRoom } from "../controllers/chat.controller";


/* 
    ADMINS/PHARMACIES
*/
router.post("/admin/chat_rooms/new", checkAdminRole, createChatRoom);
router.get("/admin/chat_rooms", checkAdminRole, getChatRooms);
router.get("/admin/chat_rooms/:room_id/chats", checkAdminRole, getChatsInRoom);
router.post("/admin/chat_rooms/:room_id/new_message", checkAdminRole, sendChatToRoom);


/* 
    DOCTORS
*/
router.post("/doctor/chat_rooms/new", checkDoctorRole, createChatRoom);
router.get("/doctor/chat_rooms", checkDoctorRole, getChatRooms);
router.get("/doctor/chat_rooms/:room_id/chats", checkDoctorRole, getChatsInRoom);
router.post("/doctor/chat_rooms/:room_id/new_message", checkDoctorRole, sendChatToRoom);


/* 
    USERS
*/
router.post("/user/chat_rooms/new", checkUserRole, createChatRoom);
router.get("/user/chat_rooms", checkUserRole, getChatRooms);
router.get("/user/chat_rooms/:room_id/chats", checkUserRole, getChatsInRoom);
router.post("/user/chat_rooms/:room_id/new_message", checkUserRole, sendChatToRoom);


export default router;



