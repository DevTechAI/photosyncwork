
export interface Client {
  name: string;
  contact: {
    phone: string;
    email: string;
  };
  projects: {
    name: string;
    status: "Completed" | "In Progress" | "Planning";
    progress: number;
  }[];
  estimates: number;
  invoices: number;
  activeProject: boolean;
}

// Empty array instead of mock data
export const clients: Client[] = [];
