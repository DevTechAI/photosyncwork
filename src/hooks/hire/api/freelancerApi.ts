import { supabase } from "@/integrations/supabase/client";
import { Freelancer, FreelancerWithPortfolio, FreelancerFormData } from "@/types/hire";

/**
 * Fetch all freelancers from Supabase
 */
export const fetchFreelancers = async (): Promise<Freelancer[]> => {
  try {
    const { data, error } = await supabase
      .from('freelancers')
      .select('*')
      .eq('is_available', true)
      .order('rating', { ascending: false });

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching freelancers:", error);
    return [];
  }
};

/**
 * Fetch freelancers with portfolio data
 */
export const fetchFreelancersWithPortfolio = async (): Promise<FreelancerWithPortfolio[]> => {
  try {
    const { data, error } = await supabase
      .from('freelancers')
      .select(`
        *,
        portfolios:portfolio_id (
          id,
          name,
          tagline,
          about,
          services,
          contact,
          social_links
        )
      `)
      .eq('is_available', true)
      .order('rating', { ascending: false });

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching freelancers with portfolio:", error);
    return [];
  }
};

/**
 * Fetch a single freelancer with portfolio data
 */
export const fetchFreelancerWithPortfolio = async (id: string): Promise<FreelancerWithPortfolio | null> => {
  try {
    const { data, error } = await supabase
      .from('freelancers')
      .select(`
        *,
        portfolios:portfolio_id (
          id,
          name,
          tagline,
          about,
          services,
          contact,
          social_links
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error fetching freelancer with portfolio:", error);
    return null;
  }
};

/**
 * Search freelancers by specialty and location
 */
export const searchFreelancers = async (
  specialty?: string,
  location?: string,
  limit: number = 50
): Promise<FreelancerWithPortfolio[]> => {
  try {
    let query = supabase
      .from('freelancers')
      .select(`
        *,
        portfolios:portfolio_id (
          id,
          name,
          tagline,
          about,
          services,
          contact,
          social_links
        )
      `)
      .eq('is_available', true);

    if (specialty && specialty !== 'all') {
      query = query.contains('specialties', [specialty]);
    }

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    const { data, error } = await query
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error searching freelancers:", error);
    return [];
  }
};

/**
 * Add a new freelancer to Supabase
 */
export const addFreelancer = async (freelancer: FreelancerFormData): Promise<Freelancer> => {
  try {
    const { data, error } = await supabase
      .from('freelancers')
      .insert([freelancer])
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error adding freelancer:", error);
    throw error;
  }
};

/**
 * Update an existing freelancer in Supabase
 */
export const updateFreelancer = async (id: string, updates: Partial<FreelancerFormData>): Promise<Freelancer> => {
  try {
    const { data, error } = await supabase
      .from('freelancers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error updating freelancer:", error);
    throw error;
  }
};

/**
 * Delete a freelancer from Supabase
 */
export const deleteFreelancer = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('freelancers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting freelancer:", error);
    throw error;
  }
};

/**
 * Link a freelancer to their portfolio
 */
export const linkFreelancerPortfolio = async (freelancerId: string, portfolioId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('link_freelancer_portfolio', {
      freelancer_id: freelancerId,
      portfolio_id: portfolioId
    });

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error linking freelancer portfolio:", error);
    return false;
  }
};

/**
 * Fetch freelancers by specialty using the database function
 */
export const fetchFreelancersBySpecialty = async (
  specialty?: string,
  location?: string,
  limit: number = 50
): Promise<FreelancerWithPortfolio[]> => {
  try {
    const { data, error } = await supabase.rpc('get_freelancers_by_specialty', {
      specialty_filter: specialty,
      location_filter: location,
      limit_count: limit
    });

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching freelancers by specialty:", error);
    return [];
  }
};

/**
 * Get current user's freelancer profile with enlist status
 */
export const getCurrentUserFreelancerProfile = async (): Promise<Freelancer | null> => {
  try {
    const { data, error } = await supabase.rpc('get_current_user_freelancer_profile');

    if (error) throw error;
    
    return data?.[0] || null;
  } catch (error) {
    console.error("Error fetching current user freelancer profile:", error);
    return null;
  }
};

/**
 * Toggle freelancer enlist status (enlisted/delisted)
 */
export const toggleFreelancerEnlistStatus = async (freelancerId: string): Promise<string> => {
  try {
    const { data, error } = await supabase.rpc('toggle_freelancer_enlist_status', {
      f_id: freelancerId
    });

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error toggling freelancer enlist status:", error);
    throw error;
  }
};