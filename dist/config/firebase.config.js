"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucket = void 0;
// import * as admin from 'firebase-admin'
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const firebase_admin_1 = __importDefault(require("firebase-admin"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    storageBucket: `gs://${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
});
const bucket = firebase_admin_1.default.storage().bucket();
exports.bucket = bucket;
