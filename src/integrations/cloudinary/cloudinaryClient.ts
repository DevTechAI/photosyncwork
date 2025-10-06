import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "",
  api_key: import.meta.env.VITE_CLOUDINARY_API_KEY || "",
  api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET || "",
  secure: true
});

export interface CloudinaryUploadOptions {
  folder?: string;
  publicId?: string;
  transformation?: any;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  quality?: 'auto' | number;
  format?: 'auto' | 'jpg' | 'png' | 'webp' | 'gif' | 'mp4' | 'webm';
  eager?: any[];
  tags?: string[];
  context?: Record<string, string>;
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
  created_at: string;
  tags?: string[];
  context?: Record<string, string>;
}

/**
 * Upload a file to Cloudinary
 * @param file The file to upload
 * @param options Upload options including folder, transformations, etc.
 * @returns Promise with upload result
 */
export const uploadToCloudinary = async (
  file: File, 
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> => {
  const {
    folder = 'photosync',
    publicId,
    transformation,
    resourceType = 'auto',
    quality = 'auto',
    format = 'auto',
    eager,
    tags = [],
    context = {}
  } = options;

  try {
    // Convert file to base64 for upload
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Prepare upload parameters
    const uploadParams: any = {
      resource_type: resourceType,
      quality: quality,
      format: format,
      folder: folder,
      tags: tags,
      context: context,
      ...(publicId && { public_id: publicId }),
      ...(transformation && { transformation: transformation }),
      ...(eager && { eager: eager })
    };

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:${file.type};base64,${base64}`,
      uploadParams
    );

    return result as CloudinaryUploadResult;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

/**
 * Delete a file from Cloudinary
 * @param publicId The public ID of the file to delete
 * @param resourceType The resource type (image, video, raw)
 * @returns Promise with deletion result
 */
export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<any> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

/**
 * Generate Cloudinary URL with transformations
 * @param publicId The public ID of the image
 * @param transformations Cloudinary transformation options
 * @returns Transformed image URL
 */
export const getCloudinaryUrl = (
  publicId: string,
  transformations: any = {}
): string => {
  return cloudinary.url(publicId, {
    secure: true,
    ...transformations
  });
};

/**
 * Common image transformations for different use cases
 */
export const ImageTransformations = {
  // Thumbnail for gallery views
  thumbnail: {
    width: 300,
    height: 300,
    crop: 'fill',
    quality: 'auto',
    format: 'auto'
  },
  
  // Medium size for previews
  medium: {
    width: 800,
    height: 600,
    crop: 'limit',
    quality: 'auto',
    format: 'auto'
  },
  
  // Large size for full view
  large: {
    width: 1200,
    height: 800,
    crop: 'limit',
    quality: 'auto',
    format: 'auto'
  },
  
  // Square crop for profile images
  square: {
    width: 400,
    height: 400,
    crop: 'fill',
    gravity: 'face',
    quality: 'auto',
    format: 'auto'
  },
  
  // WebP format for better compression
  webp: {
    format: 'webp',
    quality: 'auto'
  },
  
  // Blur placeholder for lazy loading
  blur: {
    effect: 'blur:1000',
    quality: 1,
    format: 'auto'
  },
  
  // Auto crop with face detection
  autoCrop: {
    crop: 'thumb',
    gravity: 'auto',
    quality: 'auto',
    format: 'auto'
  }
};

/**
 * Generate responsive image URLs for different screen sizes
 * @param publicId The public ID of the image
 * @param baseTransformations Base transformations to apply
 * @returns Object with URLs for different breakpoints
 */
export const getResponsiveUrls = (
  publicId: string,
  baseTransformations: any = {}
) => {
  return {
    mobile: getCloudinaryUrl(publicId, {
      ...baseTransformations,
      width: 400,
      height: 300,
      crop: 'fill'
    }),
    tablet: getCloudinaryUrl(publicId, {
      ...baseTransformations,
      width: 800,
      height: 600,
      crop: 'limit'
    }),
    desktop: getCloudinaryUrl(publicId, {
      ...baseTransformations,
      width: 1200,
      height: 800,
      crop: 'limit'
    }),
    original: getCloudinaryUrl(publicId, baseTransformations)
  };
};

export default cloudinary;
