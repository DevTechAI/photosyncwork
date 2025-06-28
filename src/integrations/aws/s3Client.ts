import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// AWS S3 configuration
const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || ""
  }
});

// S3 bucket name
const bucketName = import.meta.env.VITE_AWS_BUCKET_NAME || "";

/**
 * Upload a file to AWS S3
 * @param file The file to upload
 * @param key The key (path) to store the file at
 * @returns The URL of the uploaded file
 */
export const uploadToS3 = async (file: File, key: string): Promise<string> => {
  if (!bucketName) {
    throw new Error("AWS S3 bucket name is not configured");
  }

  try {
    // Create the upload command
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: file.type,
      ACL: "public-read" // Make the file publicly accessible
    });

    // Execute the upload
    await s3Client.send(command);

    // Return the URL of the uploaded file
    return `https://${bucketName}.s3.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

/**
 * Delete a file from AWS S3
 * @param key The key (path) of the file to delete
 */
export const deleteFromS3 = async (key: string): Promise<void> => {
  if (!bucketName) {
    throw new Error("AWS S3 bucket name is not configured");
  }

  try {
    // Create the delete command
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    // Execute the delete
    await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting from S3:", error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

/**
 * Generate a presigned URL for a file in S3
 * @param key The key (path) of the file
 * @returns The presigned URL
 */
export const getS3Url = (key: string): string => {
  if (!bucketName) {
    throw new Error("AWS S3 bucket name is not configured");
  }
  
  return `https://${bucketName}.s3.amazonaws.com/${key}`;
};