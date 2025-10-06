import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CloudinaryUploadRequest {
  fileName: string;
  contentBase64: string;
  contentType: string;
  folder?: string;
  transformations?: any;
  tags?: string[];
  context?: Record<string, string>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      fileName, 
      contentBase64, 
      contentType, 
      folder = 'photosync',
      transformations,
      tags = [],
      context = {}
    }: CloudinaryUploadRequest = await req.json();

    // Get Cloudinary credentials from environment
    const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME');
    const apiKey = Deno.env.get('CLOUDINARY_API_KEY');
    const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET');

    console.log('Cloudinary Config check:', {
      hasCloudName: !!cloudName,
      hasApiKey: !!apiKey,
      hasApiSecret: !!apiSecret
    });

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Missing Cloudinary configuration. Please check your environment variables.');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${folder}/${timestamp}-${randomString}`;

    // Prepare upload parameters
    const uploadParams = new URLSearchParams({
      file: `data:${contentType};base64,${contentBase64}`,
      public_id: uniqueFileName,
      resource_type: contentType.startsWith('video/') ? 'video' : 'image',
      quality: 'auto',
      format: 'auto',
      folder: folder,
      tags: ['photosync', 'supabase', ...tags].join(','),
      context: JSON.stringify({
        original_filename: fileName,
        uploaded_via: 'supabase',
        uploaded_at: new Date().toISOString(),
        ...context
      }),
      ...(transformations && { transformation: JSON.stringify(transformations) })
    });

    // Create Cloudinary upload URL
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${contentType.startsWith('video/') ? 'video' : 'image'}/upload`;

    // Upload to Cloudinary
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${apiKey}:${apiSecret}`)}`
      },
      body: uploadParams.toString()
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary upload failed:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText
      });
      throw new Error(`Cloudinary upload failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('File uploaded successfully to Cloudinary:', result.secure_url);

    return new Response(
      JSON.stringify({
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        fileName: uniqueFileName,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        createdAt: result.created_at
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
    console.error('Error in upload-to-cloudinary function:', error);
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
}

serve(handler)
