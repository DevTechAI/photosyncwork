
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";

interface GalleryGridProps { 
  photos: Array<{id: string; url: string; thumbnail: string; selected: boolean; favorite: boolean}>;
  onPhotoClick: (id: string) => void;
  onSelectPhoto: (id: string) => void;
  onFavoritePhoto: (id: string) => void;
}

export function GalleryGrid({ 
  photos, 
  onPhotoClick,
  onSelectPhoto,
  onFavoritePhoto
}: GalleryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div key={photo.id} className="relative group overflow-hidden rounded-lg">
          <img 
            src={photo.thumbnail} 
            alt="Gallery photo" 
            className="w-full h-64 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
            onClick={() => onPhotoClick(photo.id)}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
          <div className="absolute bottom-2 right-2 flex gap-2">
            <Button 
              size="icon" 
              variant={photo.selected ? "default" : "outline"}
              className="h-8 w-8 bg-white bg-opacity-80 text-black hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                onSelectPhoto(photo.id);
              }}
            >
              {photo.selected ? "✓" : " "}
            </Button>
            <Button 
              size="icon" 
              variant="outline"
              className={`h-8 w-8 bg-white bg-opacity-80 ${photo.favorite ? 'text-red-500' : 'text-gray-500'} hover:bg-white hover:text-red-500`}
              onClick={(e) => {
                e.stopPropagation();
                onFavoritePhoto(photo.id);
              }}
            >
              <Heart className="h-4 w-4" fill={photo.favorite ? "currentColor" : "none"} />
            </Button>
          </div>
          {photo.selected && (
            <div className="absolute top-2 left-2">
              <Badge>Selected</Badge>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
