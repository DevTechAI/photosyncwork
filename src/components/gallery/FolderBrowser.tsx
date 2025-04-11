
import React from 'react';
import { Folder, Image, ChevronRight, Users, CalendarDays, ArrowLeft } from 'lucide-react';
import { Gallery } from '@/services/gallery/types';
import { Button } from '@/components/ui/button';

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
  return (
    <div className="space-y-4">
      {/* Breadcrumb navigation */}
      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2"
          onClick={() => onNavigate(null)}
          disabled={currentPath.length === 0}
        >
          <Users className="h-4 w-4 mr-1" />
          <span>Clients</span>
        </Button>
        
        {currentPath.map((item, index) => (
          <React.Fragment key={item.id}>
            <ChevronRight className="h-4 w-4" />
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 px-2"
              onClick={() => {
                // Navigate to this level in the path
                const targetItem = index === currentPath.length - 1 ? null : currentPath[index];
                onNavigate(targetItem);
              }}
            >
              {item.isFolder ? (
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
      )}
      
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
                <Folder className="h-8 w-8 text-blue-500" />
              ) : (
                <Image className="h-8 w-8 text-green-500" />
              )}
              <div>
                <h3 className="font-medium">{folder.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {folder.isFolder ? 'Client' : 'Event'} • {new Date(folder.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {folders.length === 0 && (
          <div className="col-span-full text-center p-12 border rounded-lg">
            <p className="text-muted-foreground">No items found in this location.</p>
          </div>
        )}
      </div>
    </div>
  );
}
