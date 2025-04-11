
import { useState } from 'react';
import { GalleryHeader } from './view/GalleryHeader';
import { GalleryInstructions } from './view/GalleryInstructions';
import { GalleryTabs } from './view/GalleryTabs';
import { PhotoLightbox } from './view/PhotoLightbox';

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
      <GalleryHeader eventName={eventName} clientName={clientName} />
      <GalleryInstructions />
      
      <GalleryTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        photos={photos}
        filteredPhotos={filteredPhotos}
        onPhotoClick={handlePhotoClick}
        onSelectPhoto={handleSelectPhoto}
        onFavoritePhoto={handleFavoritePhoto}
      />
      
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
