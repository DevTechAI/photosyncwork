
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export interface Gallery {
  id: string;
  name: string;
  eventId: string;
  clientName: string;
  createdAt: string;
}

export interface Photo {
  id: string;
  galleryId: string;
  url: string;
  thumbnail: string;
  selected: boolean;
  favorite: boolean;
}

export interface RecognizedPerson {
  id: string;
  galleryId: string;
  name: string;
  referencePhotoId: string | null;
  faceCount: number; // Calculated field
}

// Gallery functions
export async function createGallery(name: string, eventId: string, clientName: string): Promise<Gallery | null> {
  try {
    const { data, error } = await supabase
      .from('photo_galleries')
      .insert([{ name, event_id: eventId, client_name: clientName }])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating gallery:", error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      eventId: data.event_id,
      clientName: data.client_name,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error("Error creating gallery:", error);
    return null;
  }
}

export async function getGalleries(): Promise<Gallery[]> {
  try {
    const { data, error } = await supabase
      .from('photo_galleries')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching galleries:", error);
      return [];
    }
    
    return data.map(gallery => ({
      id: gallery.id,
      name: gallery.name,
      eventId: gallery.event_id,
      clientName: gallery.client_name,
      createdAt: gallery.created_at
    }));
  } catch (error) {
    console.error("Error fetching galleries:", error);
    return [];
  }
}

export async function getGalleryById(id: string): Promise<Gallery | null> {
  try {
    const { data, error } = await supabase
      .from('photo_galleries')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching gallery with id ${id}:`, error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      eventId: data.event_id,
      clientName: data.client_name,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error(`Error fetching gallery with id ${id}:`, error);
    return null;
  }
}

// Photo functions
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
    const filePath = `galleries/${galleryId}/${fileName}`;
    const thumbnailPath = `galleries/${galleryId}/thumbnails/${fileName}`;
    
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

// Face recognition functions
export async function getRecognizedPeopleByGalleryId(galleryId: string): Promise<RecognizedPerson[]> {
  try {
    // Get recognized people
    const { data: peopleData, error: peopleError } = await supabase
      .from('recognized_people')
      .select('id, name, gallery_id, reference_photo_id')
      .eq('gallery_id', galleryId);
    
    if (peopleError) {
      console.error(`Error fetching recognized people for gallery ${galleryId}:`, peopleError);
      return [];
    }
    
    // For each person, count the faces associated with them
    const peopleWithFaceCounts: RecognizedPerson[] = [];
    
    for (const person of peopleData) {
      const { count, error: countError } = await supabase
        .from('faces')
        .select('*', { count: 'exact', head: true })
        .eq('person_name', person.name)
        .in('photo_id', function(subquery) {
          return subquery.select('id')
            .from('photos')
            .eq('gallery_id', galleryId);
        });
      
      if (countError) {
        console.error(`Error counting faces for person ${person.name}:`, countError);
        continue;
      }
      
      peopleWithFaceCounts.push({
        id: person.id,
        galleryId: person.gallery_id,
        name: person.name,
        referencePhotoId: person.reference_photo_id,
        faceCount: count || 0
      });
    }
    
    return peopleWithFaceCounts;
  } catch (error) {
    console.error(`Error fetching recognized people for gallery ${galleryId}:`, error);
    return [];
  }
}

export async function createRecognizedPerson(galleryId: string, name: string, referencePhotoId: string | null = null): Promise<RecognizedPerson | null> {
  try {
    const { data, error } = await supabase
      .from('recognized_people')
      .insert([{ 
        gallery_id: galleryId, 
        name,
        reference_photo_id: referencePhotoId
      }])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating recognized person:", error);
      return null;
    }
    
    return {
      id: data.id,
      galleryId: data.gallery_id,
      name: data.name,
      referencePhotoId: data.reference_photo_id,
      faceCount: 0 // New person has no faces yet
    };
  } catch (error) {
    console.error("Error creating recognized person:", error);
    return null;
  }
}
