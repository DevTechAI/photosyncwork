
import { CreateClientAccess } from "@/components/clientPortal/CreateClientAccess";
import { ScheduledEvent } from "@/components/scheduling/types";
import { useToast } from "@/components/ui/use-toast";

interface ClientAccessSectionProps {
  selectedEvent: ScheduledEvent;
}

export function ClientAccessSection({ selectedEvent }: ClientAccessSectionProps) {
  const { toast } = useToast();
  
  const handleClientAccessCreated = () => {
    toast({
      title: "Client Access Created",
      description: "Client can now access their deliverables using the provided access code."
    });
  };
  
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium">Client Portal Access</h3>
      <CreateClientAccess 
        selectedEvent={selectedEvent}
        onAccessCreated={handleClientAccessCreated}
      />
    </div>
  );
}
