
import { ScheduledEvent, TeamMember, EventAssignment } from "@/components/scheduling/types";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { scheduledEventToDb } from "@/utils/supabaseConverters";

export function useEventAssignment(events: ScheduledEvent[], setEvents: React.Dispatch<React.SetStateAction<ScheduledEvent[]>>, teamMembers: TeamMember[]) {
  const { toast } = useToast();
  
  const handleAssignTeamMember = async (eventId: string, teamMemberId: string, role: string) => {
    try {
      const event = events.find(e => e.id === eventId);
      const teamMember = teamMembers.find(t => t.id === teamMemberId);
      
      if (event && teamMember) {
        const newAssignment: EventAssignment = {
          eventId,
          eventName: event.name,
          date: event.date,
          location: event.location,
          teamMemberId,
          status: "pending",
          notes: `Assigned as ${role}`
        };
        
        const updatedEvents = events.map(e => {
          if (e.id === eventId) {
            return {
              ...e,
              assignments: [...e.assignments, newAssignment]
            };
          }
          return e;
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
            console.error("Error updating assignments in Supabase:", error);
            toast({
              title: "Error",
              description: "Failed to assign team member. Please try again.",
              variant: "destructive"
            });
            return;
          }
          
          // Update local state
          setEvents(updatedEvents);
          
          toast({
            title: "Team Member Assigned",
            description: `${teamMember.name} has been assigned to ${event.name}.`
          });
        }
      }
    } catch (error) {
      console.error("Error in handleAssignTeamMember:", error);
    }
  };
  
  return { handleAssignTeamMember };
}
