"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersWeDontDeliverToByIdController = exports.getUsersWeDontDeliverToController = exports.addUsersWeDontDeliverToController = void 0;
const UsersWeDontDeliverTo_model_1 = __importDefault(require("../models/UsersWeDontDeliverTo.model"));
// Create a new user entry
const addUsersWeDontDeliverToController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, address, state } = req.body;
    try {
        const user = yield UsersWeDontDeliverTo_model_1.default.create({ email, address, state });
        res.status(201).json({ message: "Information Saved Successfully", user });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Failed to retrieve users", error: error.message });
    }
});
exports.addUsersWeDontDeliverToController = addUsersWeDontDeliverToController;
// Get all user entries
const getUsersWeDontDeliverToController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield UsersWeDontDeliverTo_model_1.default.find();
        res
            .status(200)
            .json({ message: "Information Retrieved Successfully", users });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Failed to retrieve users", error: error.message });
    }
});
exports.getUsersWeDontDeliverToController = getUsersWeDontDeliverToController;
// Find a user entry by ID
const getUsersWeDontDeliverToByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield UsersWeDontDeliverTo_model_1.default.findById(id);
        if (!user) {
            res.status(404).json({ error: "User not found" });
        }
        else {
            res
                .status(200)
                .json({ message: "Information Retrieved Successfully", user });
        }
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Failed to retrieve users", error: error.message });
    }
});
exports.getUsersWeDontDeliverToByIdController = getUsersWeDontDeliverToByIdController;
