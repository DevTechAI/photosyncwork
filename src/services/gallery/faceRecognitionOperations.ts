
import { supabase } from "@/integrations/supabase/client";
import { RecognizedPerson } from "./types";

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
      // First get all photo ids from the gallery
      const { data: photoData, error: photoError } = await supabase
        .from('photos')
        .select('id')
        .eq('gallery_id', galleryId);
      
      if (photoError) {
        console.error(`Error fetching photos for gallery ${galleryId}:`, photoError);
        continue;
      }
      
      // Then count faces for this person in those photos
      const photoIdArray = photoData.map(photo => photo.id);
      
      // Only proceed if there are photo IDs
      if (photoIdArray.length > 0) {
        const { count, error: countError } = await supabase
          .from('faces')
          .select('*', { count: 'exact', head: true })
          .eq('person_name', person.name)
          .in('photo_id', photoIdArray);
      
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
      } else {
        // If no photos exist yet, still add the person with 0 face count
        peopleWithFaceCounts.push({
          id: person.id,
          galleryId: person.gallery_id,
          name: person.name,
          referencePhotoId: person.reference_photo_id,
          faceCount: 0
        });
      }
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
