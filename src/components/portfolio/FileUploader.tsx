import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, Loader2, Cloud, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { uploadToS3 } from "@/integrations/aws/s3Client";
import { uploadToCloudinary, ImageTransformations } from "@/integrations/cloudinary/cloudinaryClient";

interface FileUploaderProps {
  onUploadComplete: (url: string, fileName: string, publicId?: string) => void;
  acceptedFileTypes?: string;
  maxFileSize?: number; // in MB
  folder?: string;
  storageProvider?: 's3' | 'cloudinary' | 'auto';
  enableTransformations?: boolean;
}

export function FileUploader({ 
  onUploadComplete, 
  acceptedFileTypes = "image/*",
  maxFileSize = 10,
  folder = "portfolio"
}: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user, profile, updateProfile } = useAuth();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxFileSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxFileSize}MB`,
        variant: "destructive"
      });
      return;
    }

    // Check storage quota for authenticated users
    if (user && profile) {
      const remainingSpace = profile.storage_limit - profile.storage_used;
      if (file.size > remainingSpace) {
        const remainingGB = remainingSpace / (1024 * 1024 * 1024);
        toast({
          title: "Storage quota exceeded",
          description: `You have ${remainingGB.toFixed(2)}GB remaining. Please upgrade or free up space.`,
          variant: "destructive"
        });
        return;
      }
    }

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create user-specific folder structure
      const userFolder = user ? `user-${user.uid}/${folder}` : `public/${folder}`;
      const timestamp = Date.now();
      const fileName = `${timestamp}-${selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const key = `${userFolder}/${fileName}`;

      // Upload file to S3
      const url = await uploadToS3(selectedFile, key);

      // Update user's storage usage if authenticated
      if (user && profile) {
        await updateProfile({
          storage_used: profile.storage_used + selectedFile.size
        });
      }

      toast({
        title: "Upload successful",
        description: "File has been uploaded successfully"
      });
      
      onUploadComplete(url, selectedFile.name);
      clearFile();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {user && profile && (
            <div className="text-sm text-muted-foreground">
              Storage: {((profile.storage_used / (1024 * 1024 * 1024)) * 100 / (profile.storage_limit / (1024 * 1024 * 1024))).toFixed(1)}% used
              ({(profile.storage_used / (1024 * 1024 * 1024)).toFixed(2)}GB / {(profile.storage_limit / (1024 * 1024 * 1024)).toFixed(0)}GB)
            </div>
          )}
          
          <div>
            <Label htmlFor="file-upload">Select File</Label>
            <Input
              id="file-upload"
              type="file"
              accept={acceptedFileTypes}
              onChange={handleFileSelect}
              disabled={isUploading}
              ref={fileInputRef}
            />
          </div>

          {selectedFile && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm font-medium">{selectedFile.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFile}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {previewUrl && (
                <div className="relative w-32 h-32">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}

              {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={uploadFile}
                  disabled={isUploading}
                  className="flex-1"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={clearFile}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}