"use strict";
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3 = void 0;
// export const uploadToS3 = async (buffer: Buffer, filename: string): Promise<any> => {
// if(!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_BUCKET_NAME){
//   return
// }
//   const s3 = new S3Client({
//     region: 'us-east-1',
//     credentials: {
//       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     },
//   });
//   const params = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: filename,
//     Body: buffer,
//     ContentType: 'image/jpeg',
//     ACL: 'public-read',
//   };
//   const command = new PutObjectCommand(params);
//   try {
//     const response = await s3.send(command);
//     return response;
//   } catch (error) {
//     console.error('Error uploading to S3:', error);
//     throw error;
//   }
// };
const client_s3_1 = require("@aws-sdk/client-s3");
const uploadToS3 = (buffer, originalFilename) => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_BUCKET_NAME) {
        return null;
    }
    const s3 = new client_s3_1.S3Client({
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });
    const timestamp = Date.now().toString();
    const key = `${timestamp}-${originalFilename}`;
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: 'image/jpeg',
        ACL: 'public-read',
    };
    const command = new client_s3_1.PutObjectCommand(params);
    try {
        const response = yield s3.send(command);
        const fileLocation = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
        return { response, Location: fileLocation };
    }
    catch (error) {
        console.error('Error uploading to S3:', error);
        throw error;
    }
});
exports.uploadToS3 = uploadToS3;
