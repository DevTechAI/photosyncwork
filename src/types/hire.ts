/**
 * Freelancer interface representing a freelancer in the database
 */
export interface Freelancer {
  id: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  reviewCount: number;
  hourlyRate: string;
  avatar: string;
  specialties: string[];
  isAvailable: boolean;
  // New fields for enhanced freelancer management
  portfolio_id?: string;
  user_id?: string;
  email?: string;
  phone?: string;
  bio?: string;
  experience_years?: number;
  portfolio_url?: string;
  website?: string;
  linkedin?: string;
  instagram?: string;
  enlist_status?: 'enlisted' | 'delisted';
  created_at?: string;
  updated_at?: string;
}

/**
 * Job interface representing a job posting in the database
 */
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  budget: string;
  date: string;
  description: string;
  requirements: string[];
  postedDate: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * JobFormData interface for creating or updating a job
 */
export interface JobFormData {
  title: string;
  company: string;
  location: string;
  type: string;
  budget: string;
  date: string;
  description: string;
  requirements: string[];
}

/**
 * FreelancerFormData interface for creating or updating a freelancer
 */
export interface FreelancerFormData {
  name: string;
  role: string;
  location: string;
  hourlyRate: string;
  avatar: string;
  specialties: string[];
  isAvailable: boolean;
  // New fields for enhanced freelancer management
  portfolio_id?: string;
  email?: string;
  phone?: string;
  bio?: string;
  experience_years?: number;
  portfolio_url?: string;
  website?: string;
  linkedin?: string;
  instagram?: string;
  enlist_status?: 'enlisted' | 'delisted';
}

/**
 * FreelancerWithPortfolio interface combining freelancer and portfolio data
 */
export interface FreelancerWithPortfolio extends Freelancer {
  portfolio?: {
    id: string;
    name: string;
    tagline?: string;
    about?: string;
    services: string[];
    contact: {
      email: string;
      phone: string;
      location: string;
    };
    social_links: {
      instagram: string;
      facebook: string;
      website: string;
    };
  };
}

/**
 * FreelancerSearchFilters interface for filtering freelancers
 */
export interface FreelancerSearchFilters {
  specialty?: string;
  location?: string;
  minRating?: number;
  maxHourlyRate?: number;
  experience_years?: number;
  isAvailable?: boolean;
  hasPortfolio?: boolean;
}