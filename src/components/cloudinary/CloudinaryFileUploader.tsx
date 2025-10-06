import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Image as ImageIcon, Video, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadToCloudinary, ImageTransformations, CloudinaryUploadOptions } from '@/integrations/cloudinary/cloudinaryClient';
import { useAuth } from '@/contexts/AuthContext';

interface CloudinaryFileUploaderProps {
  onUploadComplete: (url: string, fileName: string, publicId: string) => void;
  acceptedFileTypes?: string;
  maxFileSize?: number; // in MB
  folder?: string;
  transformations?: any;
  autoUpload?: boolean;
  showPreview?: boolean;
  multiple?: boolean;
  className?: string;
}

export function CloudinaryFileUploader({ 
  onUploadComplete, 
  acceptedFileTypes = "image/*,video/*",
  maxFileSize = 50,
  folder = "photosync",
  transformations,
  autoUpload = false,
  showPreview = true,
  multiple = false,
  className = ""
}: CloudinaryFileUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{url: string, fileName: string, publicId: string}>>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validate file types
    const validFiles = files.filter(file => {
      const isValidType = acceptedFileTypes.split(',').some(type => {
        const trimmedType = type.trim();
        if (trimmedType.includes('/*')) {
          return file.type.startsWith(trimmedType.replace('/*', '/'));
        }
        return file.type === trimmedType;
      });
      
      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type`,
          variant: "destructive"
        });
        return false;
      }
      
      // Validate file size
      if (file.size > maxFileSize * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than ${maxFileSize}MB`,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    setSelectedFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
    
    // Generate preview URLs
    const newPreviewUrls = validFiles.map(file => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      return null;
    }).filter(Boolean) as string[];
    
    setPreviewUrls(prev => multiple ? [...prev, ...newPreviewUrls] : newPreviewUrls);

    if (autoUpload) {
      uploadFiles(validFiles);
    }
  };

  const uploadFiles = async (filesToUpload: File[] = selectedFiles) => {
    if (filesToUpload.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    const uploadedResults: Array<{url: string, fileName: string, publicId: string}> = [];

    try {
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        
        // Create user-specific folder structure
        const userFolder = user ? `${folder}/user-${user.uid}` : folder;
        
        // Prepare upload options
        const uploadOptions: CloudinaryUploadOptions = {
          folder: userFolder,
          resourceType: file.type.startsWith('video/') ? 'video' : 'image',
          quality: 'auto',
          format: 'auto',
          tags: ['photosync', 'upload'],
          context: {
            original_filename: file.name,
            uploaded_by: user?.email || 'anonymous',
            uploaded_at: new Date().toISOString()
          },
          ...(transformations && { transformation: transformations })
        };

        // Upload file to Cloudinary
        const result = await uploadToCloudinary(file, uploadOptions);
        
        uploadedResults.push({
          url: result.secure_url,
          fileName: file.name,
          publicId: result.public_id
        });

        // Update progress
        setUploadProgress(((i + 1) / filesToUpload.length) * 100);
      }

      setUploadedFiles(prev => [...prev, ...uploadedResults]);
      
      toast({
        title: "Upload successful",
        description: `${uploadedResults.length} file(s) uploaded successfully`
      });

      // Call completion callback for each uploaded file
      uploadedResults.forEach(result => {
        onUploadComplete(result.url, result.fileName, result.publicId);
      });

      clearFiles();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload files",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    setPreviewUrls([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
    if (file.type.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Upload Area */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium">Upload files to Cloudinary</p>
                <p className="text-sm text-gray-500">
                  Drag and drop files here, or click to select
                </p>
                <p className="text-xs text-gray-400">
                  Supported: {acceptedFileTypes} • Max size: {maxFileSize}MB
                </p>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedFileTypes}
              multiple={multiple}
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Selected Files ({selectedFiles.length})</h4>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file)}
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{file.type.split('/')[0]}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          disabled={isUploading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Previews */}
            {showPreview && previewUrls.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Preview</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => removeFile(index)}
                        disabled={isUploading}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            {/* Action Buttons */}
            {selectedFiles.length > 0 && !autoUpload && (
              <div className="flex space-x-2">
                <Button
                  onClick={() => uploadFiles()}
                  disabled={isUploading}
                  className="flex-1"
                >
                  {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} file(s)`}
                </Button>
                <Button
                  variant="outline"
                  onClick={clearFiles}
                  disabled={isUploading}
                >
                  Clear
                </Button>
              </div>
            )}

            {/* Uploaded Files Summary */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-green-600">Successfully Uploaded ({uploadedFiles.length})</h4>
                <div className="space-y-1">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded text-sm">
                      <span className="text-green-800">{file.fileName}</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Cloudinary
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CloudinaryFileUploader;
