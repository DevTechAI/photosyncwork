
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Heart, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GalleryViewProps {
  eventId: string;
  eventName: string;
  clientName: string;
  photos: Array<{
    id: string;
    url: string;
    thumbnail: string;
    selected: boolean;
    favorite: boolean;
  }>;
  onSelectPhoto?: (photoId: string) => void;
  onFavoritePhoto?: (photoId: string) => void;
}

export function GalleryView({ 
  eventId, 
  eventName, 
  clientName, 
  photos = [],
  onSelectPhoto,
  onFavoritePhoto
}: GalleryViewProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  
  // Filter photos based on active tab
  const filteredPhotos = activeTab === "all" 
    ? photos 
    : activeTab === "selected" 
      ? photos.filter(photo => photo.selected) 
      : photos.filter(photo => photo.favorite);
  
  // Handle photo click to view in lightbox
  const handlePhotoClick = (photoId: string) => {
    setSelectedPhoto(photoId);
  };
  
  // Handle photo selection
  const handleSelectPhoto = (photoId: string) => {
    if (onSelectPhoto) {
      onSelectPhoto(photoId);
    }
  };
  
  // Handle photo favorite
  const handleFavoritePhoto = (photoId: string) => {
    if (onFavoritePhoto) {
      onFavoritePhoto(photoId);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{eventName}</h1>
          <p className="text-muted-foreground">Client: {clientName}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share Gallery
          </Button>
          <Button variant="default" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Selected
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-4">
          <p className="text-sm mb-2">
            <Badge variant="outline" className="mr-2">Instructions</Badge>
            Welcome to your photo gallery! Browse the images from your event, mark your favorites,
            and select the ones you'd like us to process for final delivery.
          </p>
          <p className="text-xs text-muted-foreground">
            You can switch between viewing all photos, your selected photos, or your favorites using the tabs below.
          </p>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-3">
          <TabsTrigger value="all">All Photos ({photos.length})</TabsTrigger>
          <TabsTrigger value="selected">Selected ({photos.filter(p => p.selected).length})</TabsTrigger>
          <TabsTrigger value="favorites">Favorites ({photos.filter(p => p.favorite).length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <GalleryGrid 
            photos={filteredPhotos} 
            onPhotoClick={handlePhotoClick}
            onSelectPhoto={handleSelectPhoto}
            onFavoritePhoto={handleFavoritePhoto}
          />
        </TabsContent>
        
        <TabsContent value="selected" className="mt-4">
          {filteredPhotos.length > 0 ? (
            <GalleryGrid 
              photos={filteredPhotos} 
              onPhotoClick={handlePhotoClick}
              onSelectPhoto={handleSelectPhoto}
              onFavoritePhoto={handleFavoritePhoto}
            />
          ) : (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No photos selected yet.</p>
              <p className="text-sm">View all photos and click to select images for final delivery.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-4">
          {filteredPhotos.length > 0 ? (
            <GalleryGrid 
              photos={filteredPhotos} 
              onPhotoClick={handlePhotoClick}
              onSelectPhoto={handleSelectPhoto}
              onFavoritePhoto={handleFavoritePhoto}
            />
          ) : (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No favorites added yet.</p>
              <p className="text-sm">Click the heart icon on any photo to add it to your favorites.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {selectedPhoto && (
        <PhotoLightbox 
          photo={photos.find(p => p.id === selectedPhoto)!}
          onClose={() => setSelectedPhoto(null)}
          onSelectPhoto={handleSelectPhoto}
          onFavoritePhoto={handleFavoritePhoto}
        />
      )}
    </div>
  );
}

function GalleryGrid({ 
  photos, 
  onPhotoClick,
  onSelectPhoto,
  onFavoritePhoto
}: { 
  photos: Array<{id: string; url: string; thumbnail: string; selected: boolean; favorite: boolean}>;
  onPhotoClick: (id: string) => void;
  onSelectPhoto: (id: string) => void;
  onFavoritePhoto: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div key={photo.id} className="relative group overflow-hidden rounded-lg">
          <img 
            src={photo.thumbnail} 
            alt="Gallery photo" 
            className="w-full h-64 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
            onClick={() => onPhotoClick(photo.id)}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
          <div className="absolute bottom-2 right-2 flex gap-2">
            <Button 
              size="icon" 
              variant={photo.selected ? "default" : "outline"}
              className="h-8 w-8 bg-white bg-opacity-80 text-black hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                onSelectPhoto(photo.id);
              }}
            >
              {photo.selected ? "✓" : " "}
            </Button>
            <Button 
              size="icon" 
              variant="outline"
              className={`h-8 w-8 bg-white bg-opacity-80 ${photo.favorite ? 'text-red-500' : 'text-gray-500'} hover:bg-white hover:text-red-500`}
              onClick={(e) => {
                e.stopPropagation();
                onFavoritePhoto(photo.id);
              }}
            >
              <Heart className="h-4 w-4" fill={photo.favorite ? "currentColor" : "none"} />
            </Button>
          </div>
          {photo.selected && (
            <div className="absolute top-2 left-2">
              <Badge>Selected</Badge>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function PhotoLightbox({ 
  photo, 
  onClose,
  onSelectPhoto,
  onFavoritePhoto
}: { 
  photo: {id: string; url: string; selected: boolean; favorite: boolean};
  onClose: () => void;
  onSelectPhoto: (id: string) => void;
  onFavoritePhoto: (id: string) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="max-w-5xl w-full h-full flex flex-col p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button 
              variant={photo.selected ? "default" : "outline"}
              size="sm"
              onClick={() => onSelectPhoto(photo.id)}
            >
              {photo.selected ? "Selected ✓" : "Select for Delivery"}
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className={photo.favorite ? 'text-red-500' : ''}
              onClick={() => onFavoritePhoto(photo.id)}
            >
              <Heart className="h-4 w-4 mr-2" fill={photo.favorite ? "currentColor" : "none"} />
              {photo.favorite ? "Favorited" : "Add to Favorites"}
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img 
            src={photo.url} 
            alt="Full size photo" 
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
