"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// root route controller
const rootRoute = ({ req, res }) => {
    res.status(200).json({
        welcome: "welcome to theraswift api",
    });
};
exports.default = rootRoute;
