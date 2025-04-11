
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as galleryService from '@/services/galleryService';
import { useToast } from '@/components/ui/use-toast';

interface Photo {
  id: string;
  url: string;
  thumbnail: string;
  selected: boolean;
  favorite: boolean;
}

interface PhotoManagementProps {
  photos: Photo[];
  galleryId?: string;
}

export function PhotoManagement({ photos, galleryId }: PhotoManagementProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  // Handle photo upload
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!galleryId) {
      toast({
        title: "Upload Error",
        description: "No gallery selected for upload",
        variant: "destructive"
      });
      return;
    }
    
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      const file = files[0];
      const result = await galleryService.uploadPhoto(galleryId, file);
      
      if (result) {
        toast({
          title: "Upload Complete",
          description: "Photo has been uploaded successfully"
        });
      } else {
        toast({
          title: "Upload Failed",
          description: "There was an error uploading your photo",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred during upload",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Photo Management</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          disabled={isUploading || !galleryId}
          onClick={() => document.getElementById('photo-upload')?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Photos
        </Button>
        <input 
          id="photo-upload" 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handlePhotoUpload}
          disabled={isUploading}
        />
      </CardHeader>
      <CardContent>
        {isUploading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Uploading...</p>
            </div>
          </div>
        ) : (
          <>
            {photos.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center h-32">
                <div className="text-center">
                  <PlusCircle className="h-6 w-6 mx-auto text-gray-400" />
                  <p className="text-xs text-gray-400 mt-1">No photos yet. Click "Upload Photos" to add images.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {photos.map(photo => (
                  <div key={photo.id} className="relative group">
                    <img 
                      src={photo.thumbnail} 
                      alt="Gallery photo" 
                      className="w-full h-32 object-cover rounded-lg" 
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 rounded-lg" />
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1">
                      {photo.selected && (
                        <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                          Selected
                        </span>
                      )}
                      {photo.favorite && (
                        <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                          ♥
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Client Selections</h3>
              <p className="text-sm text-muted-foreground">
                {photos.filter(p => p.selected).length} of {photos.length} photos selected by client
              </p>
              
              <h3 className="text-sm font-medium mt-4 mb-2">Client Favorites</h3>
              <p className="text-sm text-muted-foreground">
                {photos.filter(p => p.favorite).length} of {photos.length} photos marked as favorites
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
