
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

export const clients: Client[] = [
  {
    name: "Sharma Family",
    contact: {
      phone: "+91 98765 43210",
      email: "sharma@email.com"
    },
    projects: [
      { name: "Wedding Photography", status: "In Progress", progress: 65 },
      { name: "Pre-Wedding Shoot", status: "Completed", progress: 100 }
    ],
    estimates: 2,
    invoices: 1,
    activeProject: true
  },
  {
    name: "TechCo Solutions",
    contact: {
      phone: "+91 98765 43211",
      email: "techco@email.com"
    },
    projects: [
      { name: "Product Launch Event", status: "Planning", progress: 25 }
    ],
    estimates: 1,
    invoices: 0,
    activeProject: true
  },
  {
    name: "Fashion Brand",
    contact: {
      phone: "+91 98765 43212",
      email: "fashion@email.com"
    },
    projects: [
      { name: "Summer Collection", status: "Completed", progress: 100 },
      { name: "Winter Catalog", status: "Planning", progress: 15 }
    ],
    estimates: 3,
    invoices: 2,
    activeProject: true
  }
];
