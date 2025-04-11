
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface PhotoLightboxProps { 
  photo: {id: string; url: string; selected: boolean; favorite: boolean};
  onClose: () => void;
  onSelectPhoto: (id: string) => void;
  onFavoritePhoto: (id: string) => void;
}

export function PhotoLightbox({ 
  photo, 
  onClose,
  onSelectPhoto,
  onFavoritePhoto
}: PhotoLightboxProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="max-w-5xl w-full h-full flex flex-col p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button 
              variant={photo.selected ? "default" : "outline"}
              size="sm"
              onClick={() => onSelectPhoto(photo.id)}
            >
              {photo.selected ? "Selected ✓" : "Select for Delivery"}
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className={photo.favorite ? 'text-red-500' : ''}
              onClick={() => onFavoritePhoto(photo.id)}
            >
              <Heart className="h-4 w-4 mr-2" fill={photo.favorite ? "currentColor" : "none"} />
              {photo.favorite ? "Favorited" : "Add to Favorites"}
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img 
            src={photo.url} 
            alt="Full size photo" 
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
