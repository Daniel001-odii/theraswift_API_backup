"use strict";
// import AWS from 'aws-sdk';
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
// export const uploadToS3 = async (file: any) =>{
//     AWS.config.update({
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//         //region: 'US East (N. Virginia) us-east-1',
//         region: 'eu-west-1',
//     });
//     const s3 = new AWS.S3();
//     const params = {
//         Bucket: 'saheedwale',
//         Key: `${Date.now()}_${file.originalname}`,
//         Body: file.buffer,
//         ACL: 'public-read', // Make the image publicly accessible
//     };
//     s3.upload(params, (err: any, data: any) => {
//         if (err) {
//           console.log(err)
//           return false;
//         }
//         // Send back the URL of the uploaded image
//         //res.status(200).json({ imageUrl: data.Location });
//         return data.Location
//       });
//     //export const s3 = new AWS.S3();
// }
const client_s3_1 = require("@aws-sdk/client-s3");
const uploadToS3 = (buffer, originalFilename) => __awaiter(void 0, void 0, void 0, function* () {
    // if(!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_BUCKET_NAME){
    //   return null
    // }
    // const awsAccessKey: string = process.env.AWS_ACCESS_KEY_ID;
    // const awsAccessSecretKey: string = process.env.AWS_SECRET_ACCESS_KEY?.toString();
    const s3 = new client_s3_1.S3Client({
        region: 'us-east-1',
        credentials: {
            accessKeyId: 'AKIAT4MDTHO7SHD5CHJD',
            secretAccessKey: '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',
        },
    });
    const timestamp = Date.now().toString();
    const key = `${timestamp}-${originalFilename}`;
    const params = {
        Bucket: 'saheedwale',
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
