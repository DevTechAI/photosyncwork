/**
 * Client interface representing a client in the database
 */
export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
  
  // Additional fields for UI display
  projects?: {
    name: string;
    status: "Completed" | "In Progress" | "Planning";
    progress: number;
  }[];
  estimates?: number;
  invoices?: number;
  activeProject?: boolean;
}

/**
 * ClientFormData interface for creating or updating a client
 */
export interface ClientFormData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}