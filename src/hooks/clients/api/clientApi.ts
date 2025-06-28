import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";

/**
 * Fetch all clients from the database
 */
export const fetchClients = async (): Promise<Client[]> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name');
    
    if (error) {
      console.error("Error fetching clients:", error);
      throw error;
    }
    
    return data as Client[];
  } catch (error) {
    console.error("Error in fetchClients:", error);
    return [];
  }
};

/**
 * Add a new client to the database
 */
export const addClient = async (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();
    
    if (error) {
      console.error("Error adding client:", error);
      throw error;
    }
    
    return data as Client;
  } catch (error) {
    console.error("Error in addClient:", error);
    throw error;
  }
};

/**
 * Update an existing client in the database
 */
export const updateClient = async (client: Client): Promise<Client> => {
  try {
    const { id, created_at, ...updateData } = client;
    
    const { data, error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating client:", error);
      throw error;
    }
    
    return data as Client;
  } catch (error) {
    console.error("Error in updateClient:", error);
    throw error;
  }
};

/**
 * Delete a client from the database
 */
export const deleteClient = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting client:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteClient:", error);
    throw error;
  }
};

/**
 * Fetch a single client by ID
 */
export const fetchClientById = async (id: string): Promise<Client | null> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching client by ID:", error);
      throw error;
    }
    
    return data as Client;
  } catch (error) {
    console.error("Error in fetchClientById:", error);
    return null;
  }
};