# AWS S3 Setup Guide for PhotoSync

## Overview
This guide will help you set up AWS S3 integration for the PhotoSync application to enable file uploads and image management.

## Prerequisites
- AWS Account
- AWS CLI installed (optional)
- Node.js and npm installed

## Step 1: Create AWS S3 Bucket

1. **Login to AWS Console**
   - Go to [AWS Console](https://aws.amazon.com/console/)
   - Navigate to S3 service

2. **Create Bucket**
   - Click "Create bucket"
   - Choose a unique bucket name (e.g., `photosync-portfolio-images`)
   - Select region (e.g., `us-east-1`)
   - Configure public access settings as needed
   - Click "Create bucket"

## Step 2: Create IAM User

1. **Navigate to IAM**
   - Go to AWS Console → IAM → Users
   - Click "Create user"

2. **User Details**
   - Username: `photosync-s3-user`
   - Select "Programmatic access"

3. **Attach Policies**
   - Click "Attach existing policies directly"
   - Search for and select `AmazonS3FullAccess`
   - Click "Next" → "Create user"

4. **Save Credentials**
   - **IMPORTANT**: Save the Access Key ID and Secret Access Key
   - You won't be able to see the Secret Access Key again

## Step 3: Configure Environment Variables

1. **Create .env file**
   ```bash
   cd photosyncwork
   cp .env.example .env
   ```

2. **Edit .env file**
   ```bash
   # AWS S3 Configuration
   VITE_AWS_REGION=us-east-1
   VITE_AWS_ACCESS_KEY_ID=AKIA...your-access-key-id
   VITE_AWS_SECRET_ACCESS_KEY=your-secret-access-key
   VITE_AWS_BUCKET_NAME=your-bucket-name
   ```

3. **Replace placeholder values**
   - `AKIA...your-access-key-id`: Your actual Access Key ID
   - `your-secret-access-key`: Your actual Secret Access Key
   - `your-bucket-name`: Your S3 bucket name

## Step 4: Test Connection

1. **Run test script**
   ```bash
   node test-s3-setup.js
   ```

2. **Expected output**
   ```
   ✅ VITE_AWS_REGION: Set
   ✅ VITE_AWS_ACCESS_KEY_ID: Set
   ✅ VITE_AWS_SECRET_ACCESS_KEY: Set
   ✅ VITE_AWS_BUCKET_NAME: Set
   ✅ Successfully connected to AWS S3!
   ```

## Step 5: Restart Development Server

1. **Stop current server**
   - Press `Ctrl+C` in terminal

2. **Restart server**
   ```bash
   npm run dev
   ```

## Step 6: Test File Upload

1. **Navigate to Portfolio**
   - Go to `http://localhost:8080/portfolio`
   - Click "Manage Portfolio"
   - Select "Wedding Photography" template
   - Click "Proceed"

2. **Test Gallery Builder**
   - Go to "Gallery" tab
   - Click "Show Image Selector"
   - Try uploading an image

## Troubleshooting

### Common Issues

1. **"Access Denied" Error**
   - Check IAM user permissions
   - Ensure S3 bucket policy allows access
   - Verify bucket name is correct

2. **"Bucket Not Found" Error**
   - Check bucket name spelling
   - Ensure bucket exists in correct region
   - Verify region matches VITE_AWS_REGION

3. **"Invalid Credentials" Error**
   - Double-check Access Key ID and Secret Access Key
   - Ensure credentials are not expired
   - Verify IAM user is active

### Security Best Practices

1. **Environment Variables**
   - Never commit .env file to version control
   - Use different credentials for development/production
   - Rotate access keys regularly

2. **IAM Permissions**
   - Use least privilege principle
   - Create custom policies instead of full access
   - Monitor access logs

3. **S3 Bucket**
   - Enable versioning for important files
   - Set up lifecycle policies
   - Monitor costs and usage

## File Structure

```
photosyncwork/
├── .env                    # Environment variables (create this)
├── .env.example           # Template file
├── test-s3-setup.js       # Connection test script
├── src/
│   ├── integrations/
│   │   └── aws/
│   │       └── s3Client.ts # S3 client configuration
│   └── components/
│       └── portfolio/
│           ├── FileUploader.tsx    # File upload component
│           └── ImageSelector.tsx   # S3 image selector
```

## Next Steps

Once S3 is configured:

1. **Upload Test Images**
   - Use the FileUploader component
   - Test different file types and sizes

2. **Configure Image Selector**
   - Update ImageSelector to fetch real S3 images
   - Add image categorization and tagging

3. **Set Up CDN** (Optional)
   - Configure CloudFront for faster image delivery
   - Set up custom domain for images

## Support

If you encounter issues:

1. Check AWS CloudTrail for access logs
2. Review S3 bucket permissions
3. Verify IAM user policies
4. Test with AWS CLI (optional)

## Cost Considerations

- S3 storage costs: ~$0.023 per GB per month
- Data transfer costs: ~$0.09 per GB
- Request costs: ~$0.0004 per 1,000 requests

Monitor usage in AWS Cost Explorer to avoid unexpected charges.


