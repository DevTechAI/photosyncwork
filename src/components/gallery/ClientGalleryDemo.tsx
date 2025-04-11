
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GalleryView } from './GalleryView';
import { FaceDetectionDemo } from './FaceDetectionDemo';
import { GallerySettings } from './components/GallerySettings';
import { PhotoManagement } from './components/PhotoManagement';

// Mock photos for the demo
const mockPhotos = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    thumbnail: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=500',
    selected: false,
    favorite: false
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    thumbnail: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=500',
    selected: true,
    favorite: false
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    thumbnail: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=500',
    selected: false,
    favorite: true
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    thumbnail: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c?w=500',
    selected: false,
    favorite: false
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    thumbnail: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8?w=500',
    selected: false,
    favorite: false
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    thumbnail: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=500',
    selected: false,
    favorite: false
  },
  {
    id: '7',
    url: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    thumbnail: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=500',
    selected: false,
    favorite: false
  },
  {
    id: '8',
    url: 'https://images.unsplash.com/photo-1583585635793-0e1894c169bd',
    thumbnail: 'https://images.unsplash.com/photo-1583585635793-0e1894c169bd?w=500',
    selected: false,
    favorite: false
  },
];

export function ClientGalleryDemo() {
  const [photos, setPhotos] = useState(mockPhotos);
  const [viewMode, setViewMode] = useState<'admin' | 'client'>('admin');
  
  // Toggle between admin and client views
  const toggleViewMode = () => {
    setViewMode(viewMode === 'admin' ? 'client' : 'admin');
  };
  
  // Select a photo
  const handleSelectPhoto = (photoId: string) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId 
        ? { ...photo, selected: !photo.selected } 
        : photo
    ));
  };
  
  // Favorite a photo
  const handleFavoritePhoto = (photoId: string) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId 
        ? { ...photo, favorite: !photo.favorite } 
        : photo
    ));
  };
  
  if (viewMode === 'client') {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-end mb-4">
          <Button variant="outline" onClick={toggleViewMode}>
            Switch to Admin View
          </Button>
        </div>
        
        <GalleryView 
          eventId="demo-event-1"
          eventName="Wedding Photoshoot - Demo"
          clientName="John & Jane Doe"
          photos={photos}
          onSelectPhoto={handleSelectPhoto}
          onFavoritePhoto={handleFavoritePhoto}
        />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Client Gallery Management</h1>
        <Button variant="outline" onClick={toggleViewMode}>
          View as Client
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <GallerySettings 
            eventName="Wedding Photoshoot - Demo" 
            clientName="John & Jane Doe" 
          />
          
          {/* Add Face Detection Feature */}
          <FaceDetectionDemo />
        </div>
        
        <div className="lg:col-span-2">
          <PhotoManagement photos={photos} />
        </div>
      </div>
    </div>
  );
}
