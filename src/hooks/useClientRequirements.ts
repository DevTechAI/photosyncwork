
import { useState, useEffect } from "react";
import { ScheduledEvent } from "@/components/scheduling/types";
import { useToast } from "@/components/ui/use-toast";

export function useClientRequirements(
  selectedEvent: ScheduledEvent | null,
  setEvents: React.Dispatch<React.SetStateAction<ScheduledEvent[]>>,
  setSelectedEvent: React.Dispatch<React.SetStateAction<ScheduledEvent | null>>
) {
  const { toast } = useToast();
  const [clientRequirements, setClientRequirements] = useState("");

  // Update selected event when client requirements change
  useEffect(() => {
    if (selectedEvent) {
      setClientRequirements(selectedEvent.clientRequirements || "");
    } else {
      setClientRequirements("");
    }
  }, [selectedEvent]);

  const handleSaveRequirements = () => {
    if (!selectedEvent) return;
    
    setEvents(prev => 
      prev.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, clientRequirements } 
          : event
      )
    );
    
    setSelectedEvent(prev => 
      prev ? { ...prev, clientRequirements } : null
    );
    
    toast({
      title: "Requirements Saved",
      description: "Client requirements have been updated successfully."
    });
  };

  return {
    clientRequirements,
    setClientRequirements,
    handleSaveRequirements
  };
}
