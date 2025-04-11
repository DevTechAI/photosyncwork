
import { supabase } from "@/integrations/supabase/client";
import { Photo } from "./types";
import { v4 as uuidv4 } from "uuid";

export async function getPhotosByGalleryId(galleryId: string): Promise<Photo[]> {
  try {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('gallery_id', galleryId);
    
    if (error) {
      console.error(`Error fetching photos for gallery ${galleryId}:`, error);
      return [];
    }
    
    return data.map(photo => ({
      id: photo.id,
      galleryId: photo.gallery_id,
      url: photo.url,
      thumbnail: photo.thumbnail,
      selected: photo.selected,
      favorite: photo.favorite
    }));
  } catch (error) {
    console.error(`Error fetching photos for gallery ${galleryId}:`, error);
    return [];
  }
}

export async function updatePhotoStatus(photoId: string, updates: { selected?: boolean, favorite?: boolean }): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('photos')
      .update(updates)
      .eq('id', photoId);
    
    if (error) {
      console.error(`Error updating photo ${photoId}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error updating photo ${photoId}:`, error);
    return false;
  }
}

export async function uploadPhoto(galleryId: string, file: File): Promise<Photo | null> {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${galleryId}/${fileName}`;
    const thumbnailPath = `${galleryId}/thumbnails/${fileName}`;
    
    console.log(`Uploading to bucket 'photos', file path: ${filePath}`);
    
    // Upload original image
    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filePath, file);
    
    if (uploadError) {
      console.error("Error uploading photo:", uploadError);
      return null;
    }
    
    // For now, we'll use the same image for thumbnail
    // In a real app, you'd create a smaller version
    const { error: thumbnailError } = await supabase.storage
      .from('photos')
      .copy(filePath, thumbnailPath);
    
    if (thumbnailError) {
      console.error("Error creating thumbnail:", thumbnailError);
      // Delete the original upload to clean up
      await supabase.storage.from('photos').remove([filePath]);
      return null;
    }
    
    // Get public URLs
    const { data: urlData } = supabase.storage
      .from('photos')
      .getPublicUrl(filePath);
    
    const { data: thumbnailData } = supabase.storage
      .from('photos')
      .getPublicUrl(thumbnailPath);
    
    // Create database record
    const photoId = uuidv4();
    const { error: dbError } = await supabase
      .from('photos')
      .insert([{
        id: photoId,
        gallery_id: galleryId,
        url: urlData.publicUrl,
        thumbnail: thumbnailData.publicUrl,
        selected: false,
        favorite: false
      }]);
    
    if (dbError) {
      console.error("Error creating photo record:", dbError);
      // Clean up storage
      await supabase.storage.from('photos').remove([filePath, thumbnailPath]);
      return null;
    }
    
    return {
      id: photoId,
      galleryId,
      url: urlData.publicUrl,
      thumbnail: thumbnailData.publicUrl,
      selected: false,
      favorite: false
    };
  } catch (error) {
    console.error("Error uploading photo:", error);
    return null;
  }
}
