
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
import { FolderBrowser } from './FolderBrowser';
import { Gallery } from '@/services/gallery/types';

export function ClientGalleryDemo() {
  const [viewMode, setViewMode] = useState<'admin' | 'client'>('admin');
  const { toast } = useToast();
  const [currentFolders, setCurrentFolders] = useState<Gallery[]>([]);
  const [currentPath, setCurrentPath] = useState<Gallery[]>([]);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize example data if needed
  useEffect(() => {
    const initializeDemoGalleries = async () => {
      try {
        setIsLoading(true);
        // Check if we have any galleries
        const galleries = await galleryService.getGalleries();
        
        if (galleries.length === 0) {
          // Create client folders (top level)
          const johnDoeClient = await galleryService.createGallery(
            'John & Jane Doe',
            'client-1',
            'John & Jane Doe',
            uuidv4(),
            null,
            true
          );
          
          const smithFamilyClient = await galleryService.createGallery(
            'Smith Family',
            'client-2',
            'Smith Family',
            uuidv4(),
            null,
            true
          );
          
          // Create event galleries as sub-folders under the clients
          if (johnDoeClient) {
            // Wedding event folder
            await galleryService.createGallery(
              'Wedding Day',
              'wedding-event',
              johnDoeClient.clientName,
              uuidv4(),
              johnDoeClient.id,
              true
            );
            
            // Engagement event folder
            await galleryService.createGallery(
              'Engagement Photos',
              'engagement-event',
              johnDoeClient.clientName,
              uuidv4(),
              johnDoeClient.id,
              true
            );
          }
          
          if (smithFamilyClient) {
            // Family reunion event folder
            await galleryService.createGallery(
              'Family Reunion',
              'family-reunion',
              smithFamilyClient.clientName,
              uuidv4(),
              smithFamilyClient.id,
              true
            );
          }
          
          toast({
            title: "Demo galleries created",
            description: "Sample client folders and event folders have been created to demonstrate the hierarchy."
          });
        }
        
        // Load root folders (clients)
        loadFolders(null);
      } catch (error) {
        console.error("Error initializing galleries:", error);
        toast({
          title: "Error",
          description: "Failed to initialize demo galleries.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeDemoGalleries();
  }, [toast]);
  
  // Load folders based on parent ID
  const loadFolders = async (parentItem: Gallery | null) => {
    try {
      setIsLoading(true);
      const parentId = parentItem?.id || null;
      const folders = await galleryService.getGalleriesByParent(parentId);
      setCurrentFolders(folders);
      
      // Update the path
      if (parentItem === null) {
        // Reset to root
        setCurrentPath([]);
      } else {
        // If navigating deeper, add to path
        const newPath = [...currentPath];
        // Check if we're going back to a parent that's already in our path
        const existingIndex = newPath.findIndex(item => item.id === parentItem.id);
        if (existingIndex >= 0) {
          // Truncate the path to this point
          setCurrentPath(newPath.slice(0, existingIndex + 1));
        } else {
          // Add to path
          setCurrentPath([...newPath, parentItem]);
        }
      }
    } catch (error) {
      console.error("Error loading folders:", error);
      toast({
        title: "Error",
        description: "Failed to load galleries.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle gallery selection
  const handleSelectGallery = (gallery: Gallery) => {
    setSelectedGallery(gallery);
  };
  
  // Use the gallery hook for selected gallery
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
  } = useGallery(selectedGallery?.id);
  
  // Toggle between admin and client views
  const toggleViewMode = () => {
    setViewMode(viewMode === 'admin' ? 'client' : 'admin');
  };
  
  // Show skeleton or loading state while data is loading
  if (isLoading) {
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
  
  // If we've selected a gallery, show it
  if (selectedGallery) {
    // Client view of selected gallery
    if (viewMode === 'client') {
      return (
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <Button variant="outline" onClick={() => setSelectedGallery(null)}>
              Back to Gallery List
            </Button>
            <Button variant="outline" onClick={toggleViewMode}>
              Switch to Admin View
            </Button>
          </div>
          
          <GalleryView 
            eventId={selectedGallery.eventId}
            eventName={selectedGallery.name}
            clientName={selectedGallery.clientName}
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
    
    // Admin view of selected gallery
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setSelectedGallery(null)}>
              Back to Gallery List
            </Button>
            <h1 className="text-2xl font-bold">{selectedGallery.name}</h1>
          </div>
          <Button variant="outline" onClick={toggleViewMode}>
            View as Client
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <GallerySettings 
              eventName={selectedGallery.name}
              clientName={selectedGallery.clientName}
              galleryId={selectedGallery.id}
            />
            
            <FaceDetectionDemo 
              people={recognizedPeople}
              selectedPeople={selectedPeople}
              onPersonSelect={handlePersonSelect}
              isLoading={isLoadingPeople}
            />
          </div>
          
          <div className="lg:col-span-2">
            <PhotoManagement photos={photos} galleryId={selectedGallery.id} />
          </div>
        </div>
      </div>
    );
  }
  
  // Show folder/gallery browser
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Client Galleries</h1>
        <Button variant="outline" onClick={toggleViewMode}>
          {viewMode === 'admin' ? 'View as Client' : 'Switch to Admin View'}
        </Button>
      </div>
      
      <FolderBrowser 
        folders={currentFolders}
        currentPath={currentPath}
        onNavigate={loadFolders}
        onSelectGallery={handleSelectGallery}
      />
    </div>
  );
}

