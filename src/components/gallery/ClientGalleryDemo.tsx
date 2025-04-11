
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GalleryView } from './GalleryView';
import { Button } from '@/components/ui/button';
import { PlusCircle, Upload } from 'lucide-react';
import { FaceDetectionDemo } from './FaceDetectionDemo';

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
          <Card>
            <CardHeader>
              <CardTitle>Gallery Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Event Information</h3>
                  <p className="text-sm text-muted-foreground">Wedding Photoshoot - Demo</p>
                  <p className="text-sm text-muted-foreground">Client: John & Jane Doe</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Gallery Status</h3>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Active</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Gallery Access</h3>
                  <div className="flex items-center justify-between border rounded p-2 text-sm">
                    <span className="truncate">https://studioclient.com/g/abc123</span>
                    <Button variant="ghost" size="sm">Copy</Button>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload More Photos
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Add Face Detection Feature */}
          <FaceDetectionDemo />
        </div>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Photo Management</CardTitle>
          </CardHeader>
          <CardContent>
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
              
              <div className="border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center h-32 cursor-pointer hover:bg-gray-50">
                <div className="text-center">
                  <PlusCircle className="h-6 w-6 mx-auto text-gray-400" />
                  <p className="text-xs text-gray-400 mt-1">Add Photos</p>
                </div>
              </div>
            </div>
            
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
