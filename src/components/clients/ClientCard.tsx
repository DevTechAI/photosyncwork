
import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import { ProjectProgress } from "./ProjectProgress";

interface Project {
  name: string;
  status: "Completed" | "In Progress" | "Planning";
  progress: number;
}

interface ClientCardProps {
  client: {
    name: string;
    contact: {
      phone: string;
      email: string;
    };
    projects: Project[];
    estimates: number;
    invoices: number;
    activeProject: boolean;
  };
}

export function ClientCard({ client }: ClientCardProps) {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium">{client.name}</h3>
          <div className="mt-2 space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="h-4 w-4 mr-2" />
              {client.contact.phone}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="h-4 w-4 mr-2" />
              {client.contact.email}
            </div>
          </div>
        </div>
        <div className="text-right">
          <Link 
            to="/estimates" 
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {client.estimates} Estimates
          </Link>
          <br />
          <Link 
            to="/invoices" 
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {client.invoices} Invoices
          </Link>
        </div>
      </div>

      <ProjectProgress projects={client.projects} />
    </div>
  );
}
