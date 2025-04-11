
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GalleryGrid } from "./GalleryGrid";
import { EmptyState } from "./EmptyState";

interface GalleryTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  photos: Array<{id: string; url: string; thumbnail: string; selected: boolean; favorite: boolean}>;
  filteredPhotos: Array<{id: string; url: string; thumbnail: string; selected: boolean; favorite: boolean}>;
  onPhotoClick: (id: string) => void;
  onSelectPhoto: (id: string) => void;
  onFavoritePhoto: (id: string) => void;
}

export function GalleryTabs({
  activeTab,
  setActiveTab,
  photos,
  filteredPhotos,
  onPhotoClick,
  onSelectPhoto,
  onFavoritePhoto
}: GalleryTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
      <TabsList className="w-full max-w-md mx-auto grid grid-cols-3">
        <TabsTrigger value="all">All Photos ({photos.length})</TabsTrigger>
        <TabsTrigger value="selected">Selected ({photos.filter(p => p.selected).length})</TabsTrigger>
        <TabsTrigger value="favorites">Favorites ({photos.filter(p => p.favorite).length})</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-4">
        <GalleryGrid 
          photos={filteredPhotos} 
          onPhotoClick={onPhotoClick}
          onSelectPhoto={onSelectPhoto}
          onFavoritePhoto={onFavoritePhoto}
        />
      </TabsContent>
      
      <TabsContent value="selected" className="mt-4">
        {filteredPhotos.length > 0 ? (
          <GalleryGrid 
            photos={filteredPhotos} 
            onPhotoClick={onPhotoClick}
            onSelectPhoto={onSelectPhoto}
            onFavoritePhoto={onFavoritePhoto}
          />
        ) : (
          <EmptyState type="selected" />
        )}
      </TabsContent>
      
      <TabsContent value="favorites" className="mt-4">
        {filteredPhotos.length > 0 ? (
          <GalleryGrid 
            photos={filteredPhotos} 
            onPhotoClick={onPhotoClick}
            onSelectPhoto={onSelectPhoto}
            onFavoritePhoto={onFavoritePhoto}
          />
        ) : (
          <EmptyState type="favorites" />
        )}
      </TabsContent>
    </Tabs>
  );
}
