import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const uploadToS3 = (buffer: Buffer, filename: string): Promise<AWS.S3.ManagedUpload.SendData> => {
  console.log(process.env.AWS_ACCESS_KEY_ID)
  console.log(process.env.AWS_SECRET_ACCESS_KEY)
  console.log(process.env.AWS_BUCKET_NAME)
  const params: AWS.S3.PutObjectRequest = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: filename,
    Body: buffer,
    ContentType: 'image/jpeg',
    ACL: 'public-read',
  };

  return s3.upload(params).promise();
};
