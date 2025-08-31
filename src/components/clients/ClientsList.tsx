import { Client } from "@/types/client";
import ClientCard from "./ClientCard";
import { Button } from "@/components/ui/button";
import { Plus, UserRound } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ClientsListProps {
  clients: Client[];
  isLoading: boolean;
  onAddClient: () => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
}

export function ClientsList({ 
  clients, 
  isLoading, 
  onAddClient, 
  onEditClient, 
  onDeleteClient 
}: ClientsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Clients</h3>
          <Button onClick={onAddClient} disabled>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Clients</h3>
        <Button onClick={onAddClient}>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>
      
      {clients.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <UserRound className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No clients yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add your first client to get started
          </p>
          <Button onClick={onAddClient}>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clients.map((client) => (
            <ClientCard 
              key={client.id} 
              client={client} 
              onEdit={() => onEditClient(client)}
              onDelete={() => onDeleteClient(client)}
            />
          ))}
        </div>
      )}
    </div>
  );
}