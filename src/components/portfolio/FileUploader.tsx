
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FileUploaderProps {
  onUploadComplete: (url: string, fileName: string) => void;
  acceptedFileTypes?: string;
  maxFileSize?: number; // in MB
  folder?: string;
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
  const { toast } = useToast();

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

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result?.toString().split(',')[1];
        if (!base64) throw new Error('Failed to read file');

        const { data: session } = await supabase.auth.getSession();
        const token = session?.session?.access_token;

        const response = await supabase.functions.invoke('upload-to-s3', {
          body: {
            fileName: selectedFile.name,
            contentBase64: base64,
            contentType: selectedFile.type,
            folder: folder
          }
        });

        if (response.error) {
          throw new Error(response.error.message);
        }

        const result = response.data;

        if (result.success) {
          toast({
            title: "Upload successful",
            description: "File has been uploaded to S3"
          });
          onUploadComplete(result.url, result.fileName);
          clearFile();
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      };

      reader.readAsDataURL(selectedFile);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="file-upload">Select File</Label>
            <Input
              id="file-upload"
              type="file"
              accept={acceptedFileTypes}
              onChange={handleFileSelect}
              disabled={isUploading}
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
                      Upload to S3
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
