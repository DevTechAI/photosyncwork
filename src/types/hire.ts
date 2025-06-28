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
}