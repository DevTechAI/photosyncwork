
import { Button } from '@/components/ui/button';
import { GalleryView } from '../GalleryView';
import { Gallery } from '@/services/gallery/types';
import { Photo } from '@/services/gallery/types';

interface ClientGalleryViewProps {
  gallery: Gallery;
  photos: Photo[];
  onBack: () => void;
  onSwitchToAdmin: () => void;
  handleSelectPhoto: (photoId: string) => void;
  handleFavoritePhoto: (photoId: string) => void;
}

export function ClientGalleryView({
  gallery,
  photos,
  onBack,
  onSwitchToAdmin,
  handleSelectPhoto,
  handleFavoritePhoto
}: ClientGalleryViewProps) {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={onBack}>
          Back to Gallery List
        </Button>
        <Button variant="outline" onClick={onSwitchToAdmin}>
          Switch to Admin View
        </Button>
      </div>
      
      <GalleryView 
        eventId={gallery.eventId}
        eventName={gallery.name}
        clientName={gallery.clientName}
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
