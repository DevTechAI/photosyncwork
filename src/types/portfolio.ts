/**
 * Portfolio interface representing a user's portfolio in the database
 */
export interface Portfolio {
  id: string;
  user_id: string;
  name: string;
  tagline: string;
  about: string;
  services: string[];
  contact: {
    email: string;
    phone: string;
    location: string;
  };
  socialLinks: {
    instagram: string;
    facebook: string;
    website: string;
  };
  created_at?: string;
  updated_at?: string;
}

/**
 * PortfolioGalleryItem interface representing an item in a portfolio gallery
 */
export interface PortfolioGalleryItem {
  id: string;
  portfolio_id: string;
  url: string;
  title: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * PortfolioFormData interface for creating or updating a portfolio
 */
export interface PortfolioFormData {
  name: string;
  tagline: string;
  about: string;
  services: string[];
  contact: {
    email: string;
    phone: string;
    location: string;
  };
  socialLinks: {
    instagram: string;
    facebook: string;
    website: string;
  };
}