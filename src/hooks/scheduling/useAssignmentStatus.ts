
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { scheduledEventToDb } from "@/utils/supabaseConverters";

export function useAssignmentStatus(events: ScheduledEvent[], setEvents: React.Dispatch<React.SetStateAction<ScheduledEvent[]>>, teamMembers: TeamMember[]) {
  const { toast } = useToast();
  
  const handleUpdateAssignmentStatus = async (
    eventId: string, 
    teamMemberId: string, 
    status: "accepted" | "declined" | "pending"
  ) => {
    try {
      const updatedEvents = events.map(event => {
        if (event.id === eventId) {
          const updatedAssignments = event.assignments.map(assignment => {
            if (assignment.teamMemberId === teamMemberId) {
              return {
                ...assignment,
                status
              };
            }
            return assignment;
          });
          
          return {
            ...event,
            assignments: updatedAssignments
          };
        }
        return event;
      });
      
      // Update in Supabase
      const updatedEvent = updatedEvents.find(e => e.id === eventId);
      if (updatedEvent) {
        const dbEvent = scheduledEventToDb(updatedEvent);
        
        const { error } = await supabase
          .from('scheduled_events')
          .update(dbEvent)
          .eq('id', eventId);
        
        if (error) {
          console.error("Error updating assignment status in Supabase:", error);
          return;
        }
      }
      
      // Update local state
      setEvents(updatedEvents);
      
      const teamMember = teamMembers.find(m => m.id === teamMemberId);
      const event = events.find(e => e.id === eventId);
      
      if (teamMember && event) {
        // Customize toast based on status
        let title, description;
        
        if (status === 'pending') {
          title = 'Assignment Reverted';
          description = `${teamMember.name}'s assignment for ${event.name} has been reverted to pending`;
        } else {
          title = `Assignment ${status === 'accepted' ? 'Accepted' : 'Declined'}`;
          description = `${teamMember.name} has ${status === 'accepted' ? 'accepted' : 'declined'} the assignment for ${event.name}.`;
        }
        
        toast({
          title,
          description
        });
      }
    } catch (error) {
      console.error("Error in handleUpdateAssignmentStatus:", error);
    }
  };

  return { handleUpdateAssignmentStatus };
}
