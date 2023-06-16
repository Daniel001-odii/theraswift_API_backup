"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
// import { ExpressArgs } from "../types/generalTypes";
const logger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
};
exports.logger = logger;
