import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!, // e.g., 'us-east-1'
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!; // e.g., 'my-app-documents'

export async function uploadDocument(
  firstName: string,
  clientId: string,
  subscriptionId: string,
  fileName: string,
  fileBuffer: Buffer,
  contentType: string
) {
  const sanitizedClientName =
    `${firstName.replace(/[^a-zA-Z0-9_-]/g, "_")}_${clientId}`.toLowerCase();
  const key = `${sanitizedClientName}/${subscriptionId}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  });
  await s3Client.send(command);
  return key; // Return the object key for reference
}

export async function listDocuments(
  firstName: string,
  clientId: string,
  subscriptionId: string
) {
  const sanitizedClientName =
    `${firstName.replace(/[^a-zA-Z0-9_-]/g, "_")}_${clientId}`.toLowerCase();
  const prefix = `${sanitizedClientName}/${subscriptionId}/`;

  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: prefix,
  });

  const { Contents } = await s3Client.send(command);
  return (
    Contents?.map((obj) => ({
      key: obj.Key!,
      url: `https://${BUCKET_NAME}.s3.amazonaws.com/${obj.Key!}`, // Public URL for each file
    })) || []
  );
}
