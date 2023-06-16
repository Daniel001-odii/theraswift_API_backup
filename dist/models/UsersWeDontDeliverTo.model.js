"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UsersWeDontDeliverToSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: false,
        unique: false,
    },
    address: {
        type: String,
        required: false,
    },
    state: {
        type: String,
        required: false,
    },
});
const UsersWeDontDeliverToModel = (0, mongoose_1.model)('UsersWeDontDeliverTo', UsersWeDontDeliverToSchema);
exports.default = UsersWeDontDeliverToModel;
