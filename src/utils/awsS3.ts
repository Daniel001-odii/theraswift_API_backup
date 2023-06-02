import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadToS3 = async (buffer: Buffer, filename: string): Promise<any> => {
  console.log(process.env.AWS_ACCESS_KEY_ID);
  console.log(process.env.AWS_SECRET_ACCESS_KEY);
  console.log(process.env.AWS_BUCKET_NAME);

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: filename,
    Body: buffer,
    ContentType: 'image/jpeg',
    ACL: 'public-read',
  };

  const command = new PutObjectCommand(params);

  try {
    const response = await s3.send(command);
    return response;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};
