
import { supabase } from "@/integrations/supabase/client";
import { Gallery } from "./types";

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
