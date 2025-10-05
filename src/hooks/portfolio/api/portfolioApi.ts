import { supabase } from "@/integrations/supabase/client";
import { Portfolio, PortfolioGalleryItem, PortfolioFormData } from "@/types/portfolio";
import { v4 as uuidv4 } from "uuid";

/**
 * Fetch a user's portfolio from Supabase
 */
export const fetchPortfolio = async (userId: string): Promise<Portfolio | null> => {
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching portfolio:", error);
      return null;
    }
    
    return data as Portfolio | null;
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return null;
  }
};

/**
 * Create a new portfolio for a user in Supabase
 */
export const createPortfolio = async (userId: string, portfolio: PortfolioFormData): Promise<Portfolio> => {
  try {
    const portfolioData = {
      user_id: userId,
      name: portfolio.name,
      tagline: portfolio.tagline,
      about: portfolio.about,
      services: portfolio.services,
      contact: portfolio.contact,
      social_links: portfolio.socialLinks,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('portfolios')
      .insert([portfolioData])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as Portfolio;
  } catch (error) {
    console.error("Error creating portfolio:", error);
    throw error;
  }
};

/**
 * Update an existing portfolio in Supabase
 */
export const updatePortfolio = async (portfolioId: string, portfolio: PortfolioFormData): Promise<Portfolio> => {
  try {
    const updateData = {
      name: portfolio.name,
      tagline: portfolio.tagline,
      about: portfolio.about,
      services: portfolio.services,
      contact: portfolio.contact,
      social_links: portfolio.socialLinks,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('portfolios')
      .update(updateData)
      .eq('id', portfolioId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as Portfolio;
  } catch (error) {
    console.error("Error updating portfolio:", error);
    throw error;
  }
};

/**
 * Fetch gallery items for a portfolio from Supabase
 */
export const fetchPortfolioGallery = async (portfolioId: string): Promise<PortfolioGalleryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('portfolio_gallery')
      .select('*')
      .eq('portfolio_id', portfolioId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return (data || []) as PortfolioGalleryItem[];
  } catch (error) {
    console.error("Error fetching portfolio gallery:", error);
    return [];
  }
};

/**
 * Add a new gallery item to a portfolio in Supabase
 */
export const addGalleryItem = async (item: Omit<PortfolioGalleryItem, 'id' | 'created_at' | 'updated_at'>): Promise<PortfolioGalleryItem> => {
  try {
    const itemData = {
      ...item,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('portfolio_gallery')
      .insert([itemData])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as PortfolioGalleryItem;
  } catch (error) {
    console.error("Error adding gallery item:", error);
    throw error;
  }
};

/**
 * Delete a gallery item from a portfolio in Supabase
 */
export const deleteGalleryItem = async (itemId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('portfolio_gallery')
      .delete()
      .eq('id', itemId);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    throw error;
  }
};