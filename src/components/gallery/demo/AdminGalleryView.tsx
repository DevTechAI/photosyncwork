
import { Button } from '@/components/ui/button';
import { GallerySettings } from '../components/GallerySettings';
import { PhotoManagement } from '../components/PhotoManagement';
import { FaceDetectionDemo } from '../FaceDetectionDemo';
import { Gallery } from '@/services/gallery/types';
import { Photo, RecognizedPerson } from '@/services/gallery/types';

interface AdminGalleryViewProps {
  gallery: Gallery;
  onBack: () => void;
  onViewAsClient: () => void;
  photos: Photo[];
  recognizedPeople: RecognizedPerson[];
  selectedPeople: string[];
  handlePersonSelect: (personId: string) => void;
  isLoadingPeople: boolean;
}

export function AdminGalleryView({
  gallery,
  onBack,
  onViewAsClient,
  photos,
  recognizedPeople,
  selectedPeople,
  handlePersonSelect,
  isLoadingPeople
}: AdminGalleryViewProps) {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onBack}>
            Back to Gallery List
          </Button>
          <h1 className="text-2xl font-bold">{gallery.name}</h1>
        </div>
        <Button variant="outline" onClick={onViewAsClient}>
          View as Client
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <GallerySettings 
            eventName={gallery.name}
            clientName={gallery.clientName}
            galleryId={gallery.id}
          />
          
          <FaceDetectionDemo 
            people={recognizedPeople}
            selectedPeople={selectedPeople}
            onPersonSelect={handlePersonSelect}
            isLoading={isLoadingPeople}
          />
        </div>
        
        <div className="lg:col-span-2">
          <PhotoManagement photos={photos} galleryId={gallery.id} />
        </div>
      </div>
    </div>
  );
}
