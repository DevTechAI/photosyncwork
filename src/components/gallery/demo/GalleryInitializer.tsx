
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import * as galleryService from '@/services/galleryService';
import { v4 as uuidv4 } from 'uuid';
import { Gallery } from '@/services/gallery/types';

interface GalleryInitializerProps {
  onLoadFolders: (parentItem: Gallery | null) => Promise<void>;
  setIsLoading: (isLoading: boolean) => void;
}

export function GalleryInitializer({ onLoadFolders, setIsLoading }: GalleryInitializerProps) {
  const { toast } = useToast();
  
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
        onLoadFolders(null);
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
  }, [toast, onLoadFolders, setIsLoading]);
  
  return null;
}
