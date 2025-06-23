
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";

interface UseDeliverableManagementProps {
  selectedEvent: ScheduledEvent;
  setSelectedEvent: (event: ScheduledEvent | null) => void;
  updateEvents: (updatedEvent: ScheduledEvent) => void;
}

export function useDeliverableManagement({
  selectedEvent,
  setSelectedEvent,
  updateEvents
}: UseDeliverableManagementProps) {
  const { toast } = useToast();
  const [isAssignDeliverableModalOpen, setIsAssignDeliverableModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [selectedDeliverableId, setSelectedDeliverableId] = useState<string | null>(null);

  const handleOpenAssignModal = (deliverableId: string) => {
    setSelectedDeliverableId(deliverableId);
    setIsAssignDeliverableModalOpen(true);
  };
  
  const handleAssignDeliverable = (teamMemberId: string, deliveryDate: string) => {
    if (!selectedEvent || !selectedDeliverableId) return;
    
    // Update the deliverable
    const updatedEvent = {
      ...selectedEvent,
      deliverables: selectedEvent.deliverables?.map(deliverable => 
        deliverable.id === selectedDeliverableId
          ? { 
              ...deliverable, 
              assignedTo: teamMemberId,
              deliveryDate,
              status: "in-progress" as const
            }
          : deliverable
      )
    };
    
    // Update events state
    updateEvents(updatedEvent);
    setSelectedEvent(updatedEvent);
    setIsAssignDeliverableModalOpen(false);
    
    toast({
      title: "Deliverable Assigned",
      description: "The deliverable has been assigned and is now in progress."
    });
  };
  
  const handleUpdateDeliverableStatus = (deliverableId: string, status: "pending" | "in-progress" | "delivered" | "revision-requested" | "completed") => {
    if (!selectedEvent) return;
    
    // Update the deliverable status
    const updatedEvent = {
      ...selectedEvent,
      deliverables: selectedEvent.deliverables?.map(deliverable => 
        deliverable.id === deliverableId
          ? { 
              ...deliverable, 
              status,
              completedDate: status === "completed" ? new Date().toISOString().split('T')[0] : deliverable.completedDate
            }
          : deliverable
      )
    };
    
    // Update events state
    updateEvents(updatedEvent);
    setSelectedEvent(updatedEvent);
    
    toast({
      title: "Status Updated",
      description: `Deliverable status has been updated to ${status.replace("-", " ")}.`
    });
  };
  
  const handleOpenRevisionModal = (deliverableId: string) => {
    setSelectedDeliverableId(deliverableId);
    setIsRevisionModalOpen(true);
  };
  
  const handleRequestRevision = (revisionNotes: string) => {
    if (!selectedEvent || !selectedDeliverableId) return;
    
    // Update the deliverable
    const updatedEvent = {
      ...selectedEvent,
      deliverables: selectedEvent.deliverables?.map(deliverable => 
        deliverable.id === selectedDeliverableId
          ? { 
              ...deliverable, 
              status: "revision-requested" as const,
              revisionNotes
            }
          : deliverable
      )
    };
    
    // Update events state
    updateEvents(updatedEvent);
    setSelectedEvent(updatedEvent);
    setIsRevisionModalOpen(false);
    
    toast({
      title: "Revision Requested",
      description: "A revision has been requested for the deliverable."
    });
  };
  
  const handleCompleteAllDeliverables = () => {
    if (!selectedEvent) return;
    
    // Check if all deliverables are completed
    const allCompleted = selectedEvent.deliverables?.every(d => d.status === "completed");
    
    if (!allCompleted) {
      toast({
        title: "Cannot Complete Event",
        description: "All deliverables must be completed before moving the event to completed status.",
        variant: "destructive"
      });
      return;
    }
    
    // Update event stage to completed
    const updatedEvent = {
      ...selectedEvent,
      stage: "completed" as const
    };
    
    // Update events state - this will remove it from the post-production list
    updateEvents(updatedEvent);
    
    // Since we're completing this event, we should clear the selected event
    setSelectedEvent(null);
    
    toast({
      title: "Event Completed",
      description: "All deliverables are completed and the event has been marked as completed."
    });
  };

  return {
    isAssignDeliverableModalOpen,
    setIsAssignDeliverableModalOpen,
    isRevisionModalOpen,
    setIsRevisionModalOpen,
    selectedDeliverableId,
    handleOpenAssignModal,
    handleAssignDeliverable,
    handleUpdateDeliverableStatus,
    handleOpenRevisionModal,
    handleRequestRevision,
    handleCompleteAllDeliverables
  };
}
