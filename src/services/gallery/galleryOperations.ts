
import { supabase } from "@/integrations/supabase/client";
import { Gallery } from "./types";

// Gallery functions
export async function createGallery(
  name: string, 
  eventId: string, 
  clientName: string, 
  id?: string, 
  parentId?: string, 
  isFolder?: boolean
): Promise<Gallery | null> {
  try {
    const galleryData: {
      name: string;
      event_id: string;
      client_name: string;
      id?: string;
      parent_id?: string;
      is_folder?: boolean;
    } = { 
      name, 
      event_id: eventId, 
      client_name: clientName 
    };
    
    // If an ID is provided, use it
    if (id) {
      galleryData.id = id;
    }

    // Add parent ID if provided (for hierarchical organization)
    if (parentId) {
      galleryData.parent_id = parentId;
    }

    // Mark as folder if specified
    if (isFolder) {
      galleryData.is_folder = isFolder;
    }
    
    const { data, error } = await supabase
      .from('photo_galleries')
      .insert([galleryData])
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
      createdAt: data.created_at,
      parentId: data.parent_id,
      isFolder: data.is_folder
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
      createdAt: gallery.created_at,
      parentId: gallery.parent_id,
      isFolder: gallery.is_folder
    }));
  } catch (error) {
    console.error("Error fetching galleries:", error);
    return [];
  }
}

export async function getGalleriesByParent(parentId: string | null): Promise<Gallery[]> {
  try {
    let query = supabase
      .from('photo_galleries')
      .select('*')
      .order('is_folder', { ascending: false })
      .order('name', { ascending: true });
      
    if (parentId) {
      query = query.eq('parent_id', parentId);
    } else {
      query = query.is('parent_id', null);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching galleries by parent:", error);
      return [];
    }
    
    return data.map(gallery => ({
      id: gallery.id,
      name: gallery.name,
      eventId: gallery.event_id,
      clientName: gallery.client_name,
      createdAt: gallery.created_at,
      parentId: gallery.parent_id,
      isFolder: gallery.is_folder
    }));
  } catch (error) {
    console.error("Error fetching galleries by parent:", error);
    return [];
  }
}

export async function getGalleryById(id: string): Promise<Gallery | null> {
  try {
    const { data, error } = await supabase
      .from('photo_galleries')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error(`Error fetching gallery with id ${id}:`, error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      eventId: data.event_id,
      clientName: data.client_name,
      createdAt: data.created_at,
      parentId: data.parent_id,
      isFolder: data.is_folder
    };
  } catch (error) {
    console.error(`Error fetching gallery with id ${id}:`, error);
    return null;
  }
}

export async function getClientFolders(): Promise<Gallery[]> {
  try {
    const { data, error } = await supabase
      .from('photo_galleries')
      .select('*')
      .eq('is_folder', true)
      .is('parent_id', null)
      .order('name', { ascending: true });
    
    if (error) {
      console.error("Error fetching client folders:", error);
      return [];
    }
    
    return data.map(gallery => ({
      id: gallery.id,
      name: gallery.name,
      eventId: gallery.event_id,
      clientName: gallery.client_name,
      createdAt: gallery.created_at,
      parentId: gallery.parent_id,
      isFolder: gallery.is_folder
    }));
  } catch (error) {
    console.error("Error fetching client folders:", error);
    return [];
  }
}
