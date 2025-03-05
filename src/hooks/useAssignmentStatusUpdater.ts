
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { useToast } from "@/components/ui/use-toast";

export function useAssignmentStatusUpdater(
  events: ScheduledEvent[],
  setEvents: React.Dispatch<React.SetStateAction<ScheduledEvent[]>>,
  selectedEvent: ScheduledEvent | null,
  setSelectedEvent: React.Dispatch<React.SetStateAction<ScheduledEvent | null>>,
  teamMembers: TeamMember[]
) {
  const { toast } = useToast();
  
  // Handle updating assignment status
  const handleUpdateAssignmentStatus = (
    eventId: string, 
    teamMemberId: string, 
    status: "accepted" | "declined" | "pending"
  ) => {
    if (!selectedEvent) return;
    
    // This eventId should match the selectedEvent.id
    if (eventId !== selectedEvent.id) {
      console.error("Event ID mismatch in handleUpdateAssignmentStatus");
      return;
    }
    
    const updatedAssignments = selectedEvent.assignments.map(assignment => {
      if (assignment.teamMemberId === teamMemberId) {
        return { ...assignment, status };
      }
      return assignment;
    });
    
    const updatedEvent = { ...selectedEvent, assignments: updatedAssignments };
    
    // Update events array
    const updatedEvents = events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    );
    
    // Save to localStorage to persist changes
    try {
      localStorage.setItem('preProductionEvents', JSON.stringify(updatedEvents));
    } catch (error) {
      console.error('Error saving events to localStorage:', error);
    }
    
    // Update state
    setEvents(updatedEvents);
    setSelectedEvent(updatedEvent);
    
    // Get team member details for notification
    const teamMember = teamMembers.find(m => m.id === teamMemberId);
    
    // Show toast notification with appropriate message based on status
    let toastTitle = '';
    let toastDescription = '';
    
    if (status === 'pending') {
      toastTitle = 'Assignment Reverted';
      toastDescription = teamMember ? 
        `${teamMember.name}'s assignment for ${selectedEvent.name} has been reverted to pending` : 
        `Assignment for ${selectedEvent.name} has been reverted to pending`;
    } else {
      toastTitle = `Assignment ${status}`;
      toastDescription = teamMember ? 
        `${teamMember.name} has ${status} the assignment for ${selectedEvent.name}` : 
        `Assignment for ${selectedEvent.name} has been ${status}`;
    }
    
    toast({
      title: toastTitle,
      description: toastDescription
    });
  };
  
  return { handleUpdateAssignmentStatus };
}
