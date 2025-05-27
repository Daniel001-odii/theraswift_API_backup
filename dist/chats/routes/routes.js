"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const roleChecker_middleware_1 = require("../../user/middlewares/roleChecker.middleware");
const rolechecker_middleware_1 = require("../../admin/middleware/rolechecker.middleware");
const rolechecke_middleware_1 = require("../../doctor/middleware/rolechecke.middleware");
const chat_controller_1 = require("../controllers/chat.controller");
/*
    ADMINS/PHARMACIES
*/
router.post("/admin/chat_rooms/new", rolechecker_middleware_1.checkAdminRole, chat_controller_1.createChatRoom);
router.get("/admin/chat_rooms", rolechecker_middleware_1.checkAdminRole, chat_controller_1.getChatRooms);
router.get("/admin/chat_rooms/:room_id/chats", rolechecker_middleware_1.checkAdminRole, chat_controller_1.getChatsInRoom);
router.post("/admin/chat_rooms/:room_id/new_message", rolechecker_middleware_1.checkAdminRole, chat_controller_1.sendChatToRoom);
/*
    DOCTORS
*/
router.post("/doctor/chat_rooms/new", rolechecke_middleware_1.checkDoctorRole, chat_controller_1.createChatRoom);
router.get("/doctor/chat_rooms", rolechecke_middleware_1.checkDoctorRole, chat_controller_1.getChatRooms);
router.get("/doctor/chat_rooms/:room_id/chats", rolechecke_middleware_1.checkDoctorRole, chat_controller_1.getChatsInRoom);
router.post("/doctor/chat_rooms/:room_id/new_message", rolechecke_middleware_1.checkDoctorRole, chat_controller_1.sendChatToRoom);
/*
    USERS
*/
router.post("/user/chat_rooms/new", roleChecker_middleware_1.checkUserRole, chat_controller_1.createChatRoom);
router.get("/user/chat_rooms", roleChecker_middleware_1.checkUserRole, chat_controller_1.getChatRooms);
router.get("/user/chat_rooms/:room_id/chats", roleChecker_middleware_1.checkUserRole, chat_controller_1.getChatsInRoom);
router.post("/user/chat_rooms/:room_id/new_message", roleChecker_middleware_1.checkUserRole, chat_controller_1.sendChatToRoom);
exports.default = router;
