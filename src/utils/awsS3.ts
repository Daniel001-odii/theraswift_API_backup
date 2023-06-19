// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';


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



import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const uploadToS3 = async (buffer: Buffer, originalFilename: string): Promise<null | {Location:string,response:any}> => {

  if(!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_BUCKET_NAME){
    return null
  }

  const s3 = new S3Client({
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

  const command = new PutObjectCommand(params);

  try {
   const response = await s3.send(command);
    const fileLocation = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
    return { response,Location:fileLocation };
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};
