
import { useState } from 'react';
import { useGallery } from '@/hooks/useGallery';
import { Gallery } from '@/services/gallery/types';
import { GalleryBrowser } from './demo/GalleryBrowser';
import { AdminGalleryView } from './demo/AdminGalleryView';
import { ClientGalleryView } from './demo/ClientGalleryView';

export function ClientGalleryDemo() {
  const [viewMode, setViewMode] = useState<'admin' | 'client'>('admin');
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  
  // Toggle between admin and client views
  const toggleViewMode = () => {
    setViewMode(viewMode === 'admin' ? 'client' : 'admin');
  };
  
  // Use the gallery hook for selected gallery
  const {
    gallery,
    photos,
    recognizedPeople,
    isLoadingPeople,
    selectedPeople,
    handleSelectPhoto,
    handleFavoritePhoto,
    handlePersonSelect
  } = useGallery(selectedGallery?.id);
  
  // If we've selected a gallery, show it
  if (selectedGallery) {
    // Client view of selected gallery
    if (viewMode === 'client') {
      return (
        <ClientGalleryView
          gallery={selectedGallery}
          photos={photos}
          onBack={() => setSelectedGallery(null)}
          onSwitchToAdmin={toggleViewMode}
          handleSelectPhoto={handleSelectPhoto}
          handleFavoritePhoto={handleFavoritePhoto}
        />
      );
    }
    
    // Admin view of selected gallery
    return (
      <AdminGalleryView
        gallery={selectedGallery}
        onBack={() => setSelectedGallery(null)}
        onViewAsClient={toggleViewMode}
        photos={photos}
        recognizedPeople={recognizedPeople}
        selectedPeople={selectedPeople}
        handlePersonSelect={handlePersonSelect}
        isLoadingPeople={isLoadingPeople}
      />
    );
  }
  
  // Show folder/gallery browser when no gallery is selected
  return (
    <GalleryBrowser
      viewMode={viewMode}
      toggleViewMode={toggleViewMode}
      onSelectGallery={setSelectedGallery}
    />
  );
}
