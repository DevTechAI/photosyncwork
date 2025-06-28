import { supabase } from "@/integrations/supabase/client";
import { Portfolio, PortfolioGalleryItem, PortfolioFormData } from "@/types/portfolio";

/**
 * Fetch a user's portfolio from the database
 */
export const fetchPortfolio = async (userId: string): Promise<Portfolio | null> => {
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No portfolio found for this user
        return null;
      }
      console.error("Error fetching portfolio:", error);
      throw error;
    }
    
    return data as Portfolio;
  } catch (error) {
    console.error("Error in fetchPortfolio:", error);
    return null;
  }
};

/**
 * Create a new portfolio for a user
 */
export const createPortfolio = async (userId: string, portfolio: PortfolioFormData): Promise<Portfolio> => {
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .insert({
        user_id: userId,
        name: portfolio.name,
        tagline: portfolio.tagline,
        about: portfolio.about,
        services: portfolio.services,
        contact: portfolio.contact,
        socialLinks: portfolio.socialLinks
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating portfolio:", error);
      throw error;
    }
    
    return data as Portfolio;
  } catch (error) {
    console.error("Error in createPortfolio:", error);
    throw error;
  }
};

/**
 * Update an existing portfolio
 */
export const updatePortfolio = async (portfolioId: string, portfolio: PortfolioFormData): Promise<Portfolio> => {
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .update({
        name: portfolio.name,
        tagline: portfolio.tagline,
        about: portfolio.about,
        services: portfolio.services,
        contact: portfolio.contact,
        socialLinks: portfolio.socialLinks,
        updated_at: new Date().toISOString()
      })
      .eq('id', portfolioId)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating portfolio:", error);
      throw error;
    }
    
    return data as Portfolio;
  } catch (error) {
    console.error("Error in updatePortfolio:", error);
    throw error;
  }
};

/**
 * Fetch gallery items for a portfolio
 */
export const fetchPortfolioGallery = async (portfolioId: string): Promise<PortfolioGalleryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('portfolio_gallery')
      .select('*')
      .eq('portfolio_id', portfolioId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching portfolio gallery:", error);
      throw error;
    }
    
    return data as PortfolioGalleryItem[];
  } catch (error) {
    console.error("Error in fetchPortfolioGallery:", error);
    return [];
  }
};

/**
 * Add a new gallery item to a portfolio
 */
export const addGalleryItem = async (item: Omit<PortfolioGalleryItem, 'id' | 'created_at' | 'updated_at'>): Promise<PortfolioGalleryItem> => {
  try {
    const { data, error } = await supabase
      .from('portfolio_gallery')
      .insert(item)
      .select()
      .single();
    
    if (error) {
      console.error("Error adding gallery item:", error);
      throw error;
    }
    
    return data as PortfolioGalleryItem;
  } catch (error) {
    console.error("Error in addGalleryItem:", error);
    throw error;
  }
};

/**
 * Delete a gallery item from a portfolio
 */
export const deleteGalleryItem = async (itemId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('portfolio_gallery')
      .delete()
      .eq('id', itemId);
    
    if (error) {
      console.error("Error deleting gallery item:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteGalleryItem:", error);
    throw error;
  }
};