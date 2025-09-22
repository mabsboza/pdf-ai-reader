'use server'
import AWS from 'aws-sdk';
import fs from 'fs';

export async function downloadFromS3(fileKey: string) {
  // Configuración manual para evitar que busque ~/.aws/config
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    region: process.env.AWS_REGION,
  });

  const s3 = new AWS.S3({
    params: { Bucket: process.env.S3_BUCKET_NAME! },
    region: process.env.AWS_REGION,
  });

  const downloadParams = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: fileKey,
  };

  const data = await s3.getObject(downloadParams).promise();
  const file_name = `./temp/pdf-${Date.now()}.pdf`;
  fs.writeFileSync(file_name, data.Body as Buffer);

  return file_name;
}
