import { supabase } from "@/integrations/supabase/client";
import { Freelancer } from "@/types/hire";

/**
 * Fetch all freelancers from the database
 */
export const fetchFreelancers = async (): Promise<Freelancer[]> => {
  try {
    const { data, error } = await supabase
      .from('freelancers')
      .select('*')
      .order('name');
    
    if (error) {
      console.error("Error fetching freelancers:", error);
      throw error;
    }
    
    return data as Freelancer[];
  } catch (error) {
    console.error("Error in fetchFreelancers:", error);
    return [];
  }
};

/**
 * Add a new freelancer to the database
 */
export const addFreelancer = async (freelancer: Omit<Freelancer, 'id' | 'created_at' | 'updated_at'>): Promise<Freelancer> => {
  try {
    const { data, error } = await supabase
      .from('freelancers')
      .insert(freelancer)
      .select()
      .single();
    
    if (error) {
      console.error("Error adding freelancer:", error);
      throw error;
    }
    
    return data as Freelancer;
  } catch (error) {
    console.error("Error in addFreelancer:", error);
    throw error;
  }
};

/**
 * Update an existing freelancer in the database
 */
export const updateFreelancer = async (freelancer: Freelancer): Promise<Freelancer> => {
  try {
    const { id, created_at, ...updateData } = freelancer;
    
    const { data, error } = await supabase
      .from('freelancers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating freelancer:", error);
      throw error;
    }
    
    return data as Freelancer;
  } catch (error) {
    console.error("Error in updateFreelancer:", error);
    throw error;
  }
};

/**
 * Delete a freelancer from the database
 */
export const deleteFreelancer = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('freelancers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting freelancer:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteFreelancer:", error);
    throw error;
  }
};

/**
 * Fetch a single freelancer by ID
 */
export const fetchFreelancerById = async (id: string): Promise<Freelancer | null> => {
  try {
    const { data, error } = await supabase
      .from('freelancers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching freelancer by ID:", error);
      throw error;
    }
    
    return data as Freelancer;
  } catch (error) {
    console.error("Error in fetchFreelancerById:", error);
    return null;
  }
};