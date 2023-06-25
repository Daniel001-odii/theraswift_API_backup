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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3 = new client_s3_1.S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});
const uploadToS3 = (buffer, filename) => __awaiter(void 0, void 0, void 0, function* () {
    const awsBucketName = process.env.AWS_BUCKET_NAME;
    if (!awsBucketName) {
        throw new Error('AWS_BUCKET_NAME environment variable is not set.');
    }
    const params = {
        Bucket: awsBucketName,
        Key: filename,
        Body: buffer,
        ContentType: 'image/jpeg',
        ACL: 'public-read',
    };
    const command = new client_s3_1.PutObjectCommand(params);
    try {
        const response = yield s3.send(command);
        return response;
    }
    catch (error) {
        console.error('Error uploading to S3:', error);
        throw error;
    }
});
exports.uploadToS3 = uploadToS3;
