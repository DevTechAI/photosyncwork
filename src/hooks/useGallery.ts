
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as galleryService from '@/services/galleryService';
import { Photo, Gallery, RecognizedPerson } from '@/services/galleryService';

export function useGallery(galleryId?: string) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'all' | 'selected' | 'favorites'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

  // Query for getting gallery
  const galleryQuery = useQuery({
    queryKey: ['gallery', galleryId],
    queryFn: () => galleryId ? galleryService.getGalleryById(galleryId) : null,
    enabled: !!galleryId
  });

  // Query for getting photos
  const photosQuery = useQuery({
    queryKey: ['photos', galleryId],
    queryFn: () => galleryId ? galleryService.getPhotosByGalleryId(galleryId) : [],
    enabled: !!galleryId
  });

  // Query for recognized people
  const peopleQuery = useQuery({
    queryKey: ['recognizedPeople', galleryId],
    queryFn: () => galleryId ? galleryService.getRecognizedPeopleByGalleryId(galleryId) : [],
    enabled: !!galleryId
  });

  // Mutation for updating photo status
  const updatePhotoMutation = useMutation({
    mutationFn: ({ photoId, updates }: { photoId: string, updates: { selected?: boolean, favorite?: boolean } }) => 
      galleryService.updatePhotoStatus(photoId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos', galleryId] });
    }
  });

  // Filter photos based on active tab and selected people
  const filteredPhotos = (() => {
    const photos = photosQuery.data || [];
    
    // First, filter by tab
    let filtered = activeTab === 'all' 
      ? photos 
      : activeTab === 'selected' 
        ? photos.filter(photo => photo.selected) 
        : photos.filter(photo => photo.favorite);
    
    // Then, if people are selected, filter further
    if (selectedPeople.length > 0 && peopleQuery.data) {
      // This is a simplified filter, in a real app we would query the faces table
      // to find all photos containing the selected people's faces
      return filtered;
    }
    
    return filtered;
  })();

  // Handle photo selection
  const handleSelectPhoto = (photoId: string) => {
    const photo = photosQuery.data?.find(p => p.id === photoId);
    if (photo) {
      updatePhotoMutation.mutate({
        photoId,
        updates: { selected: !photo.selected }
      });
    }
  };

  // Handle photo favoriting
  const handleFavoritePhoto = (photoId: string) => {
    const photo = photosQuery.data?.find(p => p.id === photoId);
    if (photo) {
      updatePhotoMutation.mutate({
        photoId,
        updates: { favorite: !photo.favorite }
      });
    }
  };

  // Handle person selection
  const handlePersonSelect = (personId: string) => {
    setSelectedPeople(prev => {
      if (prev.includes(personId)) {
        return prev.filter(id => id !== personId);
      } else {
        return [...prev, personId];
      }
    });
  };

  return {
    gallery: galleryQuery.data,
    isLoadingGallery: galleryQuery.isLoading,
    photos: photosQuery.data || [],
    isLoadingPhotos: photosQuery.isLoading,
    filteredPhotos,
    activeTab,
    setActiveTab,
    selectedPhoto,
    setSelectedPhoto,
    handleSelectPhoto,
    handleFavoritePhoto,
    recognizedPeople: peopleQuery.data || [],
    isLoadingPeople: peopleQuery.isLoading,
    selectedPeople,
    handlePersonSelect,
    isUpdating: updatePhotoMutation.isPending,
    updateError: updatePhotoMutation.error
  };
}
