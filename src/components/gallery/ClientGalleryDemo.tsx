
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GalleryView } from './GalleryView';
import { FaceDetectionDemo } from './FaceDetectionDemo';
import { GallerySettings } from './components/GallerySettings';
import { PhotoManagement } from './components/PhotoManagement';
import { useGallery } from '@/hooks/useGallery';
import * as galleryService from '@/services/galleryService';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

// Use a proper UUID for the demo gallery
const DEMO_GALLERY_ID = 'c0a80121-7ac0-4e1c-9a5f-8f21f4811766';

export function ClientGalleryDemo() {
  const [viewMode, setViewMode] = useState<'admin' | 'client'>('admin');
  const { toast } = useToast();
  
  // Initialize the gallery if it doesn't exist yet
  useEffect(() => {
    const initializeGallery = async () => {
      try {
        // Check if demo gallery exists
        const gallery = await galleryService.getGalleryById(DEMO_GALLERY_ID);
        
        if (!gallery) {
          // Create demo gallery with the specific UUID
          const newGallery = await galleryService.createGallery(
            'Demo Gallery', 
            'demo-event-1', 
            'John & Jane Doe',
            DEMO_GALLERY_ID
          );
          
          if (newGallery) {
            toast({
              title: "Demo gallery created",
              description: "Sample gallery has been created for demonstration purposes."
            });
          }
        }
      } catch (error) {
        console.error("Error initializing gallery:", error);
        toast({
          title: "Error",
          description: "Failed to initialize demo gallery.",
          variant: "destructive"
        });
      }
    };
    
    initializeGallery();
  }, [toast]);
  
  // Use the gallery hook
  const {
    gallery,
    isLoadingGallery,
    photos,
    isLoadingPhotos,
    filteredPhotos,
    activeTab,
    setActiveTab,
    selectedPhoto,
    setSelectedPhoto,
    handleSelectPhoto,
    handleFavoritePhoto,
    recognizedPeople,
    isLoadingPeople,
    selectedPeople,
    handlePersonSelect
  } = useGallery(DEMO_GALLERY_ID);
  
  // Toggle between admin and client views
  const toggleViewMode = () => {
    setViewMode(viewMode === 'admin' ? 'client' : 'admin');
  };
  
  // Show skeleton or loading state while data is loading
  if (isLoadingGallery || isLoadingPhotos) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }
  
  // If no gallery data, show error
  if (!gallery && !isLoadingGallery) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <h2 className="text-xl font-bold mb-4">Gallery Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The demo gallery could not be loaded. Please try refreshing the page.
        </p>
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Refresh Page
        </Button>
      </div>
    );
  }
  
  // Client view
  if (viewMode === 'client') {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-end mb-4">
          <Button variant="outline" onClick={toggleViewMode}>
            Switch to Admin View
          </Button>
        </div>
        
        <GalleryView 
          eventId={gallery?.eventId || 'demo-event-1'}
          eventName={gallery?.name || 'Demo Gallery'}
          clientName={gallery?.clientName || 'John & Jane Doe'}
          photos={photos.map(photo => ({
            id: photo.id,
            url: photo.url,
            thumbnail: photo.thumbnail,
            selected: photo.selected,
            favorite: photo.favorite
          }))}
          onSelectPhoto={handleSelectPhoto}
          onFavoritePhoto={handleFavoritePhoto}
        />
      </div>
    );
  }
  
  // Admin view
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
            eventName={gallery?.name || 'Demo Gallery'}
            clientName={gallery?.clientName || 'John & Jane Doe'} 
          />
          
          <FaceDetectionDemo 
            people={recognizedPeople}
            selectedPeople={selectedPeople}
            onPersonSelect={handlePersonSelect}
            isLoading={isLoadingPeople}
          />
        </div>
        
        <div className="lg:col-span-2">
          <PhotoManagement photos={photos} galleryId={DEMO_GALLERY_ID} />
        </div>
      </div>
    </div>
  );
}
