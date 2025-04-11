
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FolderBrowser } from '../FolderBrowser';
import { Gallery } from '@/services/gallery/types';
import { useToast } from '@/components/ui/use-toast';
import * as galleryService from '@/services/galleryService';
import { GalleryInitializer } from './GalleryInitializer';

interface GalleryBrowserProps {
  viewMode: 'admin' | 'client';
  toggleViewMode: () => void;
  onSelectGallery: (gallery: Gallery) => void;
}

export function GalleryBrowser({ viewMode, toggleViewMode, onSelectGallery }: GalleryBrowserProps) {
  const { toast } = useToast();
  const [currentFolders, setCurrentFolders] = useState<Gallery[]>([]);
  const [currentPath, setCurrentPath] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
        onSelectGallery={onSelectGallery}
      />
      
      {/* Initializer component */}
      <GalleryInitializer 
        onLoadFolders={loadFolders} 
        setIsLoading={setIsLoading} 
      />
      
      {/* Loading state */}
      {isLoading && currentFolders.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      )}
    </div>
  );
}
