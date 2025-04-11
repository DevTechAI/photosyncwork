
import React from 'react';
import { Folder, Image, ChevronRight, Users, CalendarDays, ArrowLeft, Plus } from 'lucide-react';
import { Gallery } from '@/services/gallery/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import * as galleryService from '@/services/galleryService';
import { v4 as uuidv4 } from 'uuid';

interface FolderBrowserProps {
  folders: Gallery[];
  currentPath: Gallery[];
  onNavigate: (folder: Gallery | null) => void;
  onSelectGallery: (gallery: Gallery) => void;
}

export function FolderBrowser({ 
  folders, 
  currentPath,
  onNavigate,
  onSelectGallery
}: FolderBrowserProps) {
  const { toast } = useToast();
  const isTopLevel = currentPath.length === 0;
  const isClientLevel = currentPath.length === 1;

  // Create a new client folder
  const handleCreateClientFolder = async () => {
    try {
      const clientName = prompt("Enter client name:");
      if (!clientName) return;
      
      const newClient = await galleryService.createGallery(
        clientName,
        `client-${uuidv4().slice(0, 8)}`, // Generate a simple event ID
        clientName,
        uuidv4(),
        null,
        true
      );
      
      if (newClient) {
        toast({
          title: "Client folder created",
          description: `New client folder '${clientName}' has been created.`
        });
        
        // Refresh the current folder
        onNavigate(null);
      }
    } catch (error) {
      console.error("Error creating client folder:", error);
      toast({
        title: "Error",
        description: "Failed to create client folder.",
        variant: "destructive"
      });
    }
  };

  // Create a new event folder under a client
  const handleCreateEventFolder = async () => {
    try {
      const parentFolder = currentPath[0]; // The client folder is always first in the path
      const eventName = prompt("Enter event name:");
      if (!eventName) return;
      
      const newEvent = await galleryService.createGallery(
        eventName,
        `event-${uuidv4().slice(0, 8)}`, // Generate a simple event ID
        parentFolder.clientName,
        uuidv4(),
        parentFolder.id,
        true
      );
      
      if (newEvent) {
        toast({
          title: "Event folder created",
          description: `New event folder '${eventName}' has been created for client '${parentFolder.clientName}'.`
        });
        
        // Refresh the current folder
        onNavigate(parentFolder);
      }
    } catch (error) {
      console.error("Error creating event folder:", error);
      toast({
        title: "Error",
        description: "Failed to create event folder.",
        variant: "destructive"
      });
    }
  };

  // Create a photo gallery under an event
  const handleCreatePhotoGallery = async () => {
    try {
      const parentFolder = currentPath[currentPath.length - 1]; // The event folder
      const galleryName = prompt("Enter gallery name:");
      if (!galleryName) return;
      
      // In this case, we're creating an actual gallery (not a folder)
      const newGallery = await galleryService.createGallery(
        galleryName,
        `gallery-${uuidv4().slice(0, 8)}`, // Generate a simple gallery ID
        parentFolder.clientName,
        uuidv4(),
        parentFolder.id,
        false // Not a folder but an actual gallery
      );
      
      if (newGallery) {
        toast({
          title: "Photo gallery created",
          description: `New photo gallery '${galleryName}' has been created.`
        });
        
        // Refresh the current folder
        onNavigate(parentFolder);
      }
    } catch (error) {
      console.error("Error creating photo gallery:", error);
      toast({
        title: "Error",
        description: "Failed to create photo gallery.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb navigation */}
      <div className="flex items-center space-x-1 text-sm text-muted-foreground overflow-x-auto pb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 flex-shrink-0"
          onClick={() => onNavigate(null)}
        >
          <Users className="h-4 w-4 mr-1" />
          <span>Clients</span>
        </Button>
        
        {currentPath.map((item, index) => (
          <React.Fragment key={item.id}>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 px-2 flex-shrink-0"
              onClick={() => {
                // Navigate to this level in the path
                onNavigate(item);
              }}
            >
              {index === 0 ? (
                <Users className="h-4 w-4 mr-1" />
              ) : (
                <CalendarDays className="h-4 w-4 mr-1" />
              )}
              <span>{item.name}</span>
            </Button>
          </React.Fragment>
        ))}
      </div>
      
      {/* Back button if we're in a subfolder */}
      {currentPath.length > 0 && (
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => {
              const parentItem = currentPath.length > 1 ? currentPath[currentPath.length - 2] : null;
              onNavigate(parentItem);
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {currentPath.length > 1 ? currentPath[currentPath.length - 2].name : 'Clients'}
          </Button>

          {/* Add appropriate creation button based on current level */}
          {isTopLevel && (
            <Button 
              variant="outline" 
              className="mb-4"
              onClick={handleCreateClientFolder}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Client
            </Button>
          )}

          {isClientLevel && (
            <Button 
              variant="outline" 
              className="mb-4"
              onClick={handleCreateEventFolder}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Event
            </Button>
          )}

          {currentPath.length > 1 && (
            <Button 
              variant="outline" 
              className="mb-4"
              onClick={handleCreatePhotoGallery}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Photo Gallery
            </Button>
          )}
        </div>
      )}

      {/* Current location title */}
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-1">
          {currentPath.length === 0 
            ? 'Clients' 
            : currentPath.length === 1 
              ? `${currentPath[0].name} - Events` 
              : `${currentPath[currentPath.length-1].name} - Galleries`}
        </h2>
        <p className="text-sm text-muted-foreground">
          {currentPath.length === 0 
            ? 'Select a client to view their events' 
            : currentPath.length === 1 
              ? 'Select an event to view its galleries or create a new event' 
              : 'Select a gallery to view photos or create a new gallery'}
        </p>
        <Separator className="mt-2" />
      </div>
      
      {/* Folder grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {folders.map(folder => (
          <div 
            key={folder.id} 
            className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
            onClick={() => folder.isFolder ? onNavigate(folder) : onSelectGallery(folder)}
          >
            <div className="flex items-center space-x-3">
              {folder.isFolder ? (
                isTopLevel ? (
                  <Users className="h-8 w-8 text-blue-500" />
                ) : (
                  <Folder className="h-8 w-8 text-blue-500" />
                )
              ) : (
                <Image className="h-8 w-8 text-green-500" />
              )}
              <div>
                <h3 className="font-medium">{folder.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {folder.isFolder 
                    ? (isTopLevel ? 'Client' : 'Event') 
                    : 'Gallery'} • {new Date(folder.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {folders.length === 0 && (
          <div className="col-span-full text-center p-12 border rounded-lg">
            <p className="text-muted-foreground">
              {isTopLevel 
                ? 'No clients found. Create a new client to get started.' 
                : isClientLevel 
                  ? 'No events found for this client. Create a new event to get started.' 
                  : 'No galleries found for this event. Create a new gallery to get started.'}
            </p>
            {isTopLevel && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={handleCreateClientFolder}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Client
              </Button>
            )}
            {isClientLevel && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={handleCreateEventFolder}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Event
              </Button>
            )}
            {currentPath.length > 1 && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={handleCreatePhotoGallery}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Photo Gallery
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
