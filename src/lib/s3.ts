import AWS from 'aws-sdk';

export async function uploadFileToS3(file: File) {
  try {
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    });
    const s3 = new AWS.S3({
      params: { Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME || '' },
      region: process.env.NEXT_PUBLIC_S3_REGION,
    });

    const file_key = 'uploads/' + Date.now().toString() + file.name.replace(' ', '_');

    const uploadParams = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME || '',
      Key: file_key,
      Body: file,
      ContentType: file.type,
    };

    const upload =  s3.putObject(uploadParams).on('httpUploadProgress', (evt) => {
      console.log('Progress:', Math.round((evt.loaded / evt.total) * 100) + '%');
    }).promise();
    await upload.then(()=> {
      console.log('Upload complete', file_key);
    });

    return Promise.resolve({
      file_key,
      file_name: file.name,
    })
  } catch (error) {
    
  }
};

export function getS3Url(file_key: string) {
  return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${file_key}`;
}