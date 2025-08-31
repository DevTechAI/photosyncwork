import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MoreVertical } from "lucide-react";
import { ProjectProgress } from "./ProjectProgress";
import { Client } from "@/types/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ClientCardProps {
  client: Client;
  onEdit?: (client: Client) => void;
  onDelete?: (client: Client) => void;
}

function ClientCard({ client, onEdit, onDelete }: ClientCardProps) {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium">{client.name}</h3>
          <div className="mt-2 space-y-1">
            {client.phone && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                {client.phone}
              </div>
            )}
            {client.email && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                {client.email}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <Link 
              to="/estimates" 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {client.estimates || 0} Estimates
            </Link>
            <br />
            <Link 
              to="/invoices" 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {client.invoices || 0} Invoices
            </Link>
          </div>
          
          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(client)}>
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(client)}
                    className="text-red-600"
                  >
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {client.projects && client.projects.length > 0 && (
        <ProjectProgress projects={client.projects} />
      )}
      
      {client.address && (
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Address:</span> {client.address}
        </div>
      )}
    </div>
  );
}

export default memo(ClientCard);