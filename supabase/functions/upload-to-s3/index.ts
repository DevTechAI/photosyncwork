
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UploadRequest {
  fileName: string;
  contentBase64: string;
  contentType: string;
  folder?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileName, contentBase64, contentType, folder = 'portfolio' }: UploadRequest = await req.json();

    // Get AWS credentials from environment
    const accessKeyId = Deno.env.get('AWS_ACCESS_KEY_ID');
    const secretAccessKey = Deno.env.get('AWS_SECRET_ACCESS_KEY');
    const region = Deno.env.get('AWS_REGION');
    const bucketName = Deno.env.get('AWS_BUCKET_NAME');

    console.log('AWS Config check:', {
      hasAccessKey: !!accessKeyId,
      hasSecretKey: !!secretAccessKey,
      region: region,
      bucketName: bucketName
    });

    if (!accessKeyId || !secretAccessKey || !region || !bucketName) {
      throw new Error('Missing AWS configuration. Please check your environment variables.');
    }

    // Clean and validate bucket name
    const cleanBucketName = bucketName.toLowerCase().replace(/[^a-z0-9\-]/g, '-').replace(/--+/g, '-');
    
    // Validate bucket name format (AWS S3 naming rules)
    if (!cleanBucketName.match(/^[a-z0-9][a-z0-9\-]*[a-z0-9]$/) || cleanBucketName.length < 3 || cleanBucketName.length > 63) {
      throw new Error(`Invalid bucket name: "${bucketName}". AWS S3 bucket names must be 3-63 characters, lowercase, and contain only letters, numbers, and hyphens. No spaces allowed. Suggested name: "${cleanBucketName}"`);
    }

    // Clean region name
    const cleanRegion = region.toLowerCase().replace(/[^a-z0-9\-]/g, '');
    if (!cleanRegion.match(/^[a-z0-9\-]+$/)) {
      throw new Error(`Invalid region format: ${region}. Should be something like "us-east-1" or "eu-west-1"`);
    }

    // Convert base64 to binary
    let binaryData;
    try {
      binaryData = Uint8Array.from(atob(contentBase64), c => c.charCodeAt(0));
    } catch (error) {
      throw new Error('Invalid base64 content provided');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${folder}/${timestamp}-${randomString}.${fileExtension}`;

    // Create properly formatted S3 URL using the clean bucket name
    const s3Url = `https://${cleanBucketName}.s3.${cleanRegion}.amazonaws.com/${uniqueFileName}`;
    console.log('Generated S3 URL:', s3Url);

    // Create the request to S3
    const response = await fetch(s3Url, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
        'Authorization': await createAwsSignature(
          'PUT',
          uniqueFileName,
          contentType,
          new Date().toISOString().slice(0, 19).replace(/[-:]/g, '') + 'Z',
          accessKeyId,
          secretAccessKey,
          cleanRegion,
          cleanBucketName
        ),
        'x-amz-date': new Date().toISOString().slice(0, 19).replace(/[-:]/g, '') + 'Z',
        'x-amz-content-sha256': await sha256(binaryData),
      },
      body: binaryData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('S3 upload failed:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText,
        bucketName: cleanBucketName,
        region: cleanRegion
      });
      throw new Error(`S3 upload failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const fileUrl = s3Url;
    console.log('File uploaded successfully:', fileUrl);

    return new Response(
      JSON.stringify({
        success: true,
        url: fileUrl,
        fileName: uniqueFileName,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Error in upload-to-s3 function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

async function sha256(data: Uint8Array): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function createAwsSignature(
  method: string,
  objectKey: string,
  contentType: string,
  dateTime: string,
  accessKeyId: string,
  secretAccessKey: string,
  region: string,
  bucketName: string
): Promise<string> {
  const date = dateTime.slice(0, 8);
  const credentialScope = `${date}/${region}/s3/aws4_request`;
  
  const canonicalRequest = [
    method,
    `/${objectKey}`,
    '',
    `host:${bucketName}.s3.${region}.amazonaws.com`,
    `x-amz-content-sha256:UNSIGNED-PAYLOAD`,
    `x-amz-date:${dateTime}`,
    '',
    'host;x-amz-content-sha256;x-amz-date',
    'UNSIGNED-PAYLOAD'
  ].join('\n');

  const stringToSign = [
    'AWS4-HMAC-SHA256',
    dateTime,
    credentialScope,
    await sha256(new TextEncoder().encode(canonicalRequest))
  ].join('\n');

  const signingKey = await getSignatureKey(secretAccessKey, date, region, 's3');
  const signature = await hmacSha256(signingKey, stringToSign);

  return `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=${signature}`;
}

async function hmacSha256(key: Uint8Array, data: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string): Promise<Uint8Array> {
  const kDate = await hmacSha256Raw(new TextEncoder().encode('AWS4' + key), dateStamp);
  const kRegion = await hmacSha256Raw(kDate, regionName);
  const kService = await hmacSha256Raw(kRegion, serviceName);
  return await hmacSha256Raw(kService, 'aws4_request');
}

async function hmacSha256Raw(key: Uint8Array, data: string): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(data));
  return new Uint8Array(signature);
}

serve(handler);
