
import { useToast } from "@/components/ui/use-toast";
import { ScheduledEvent } from "@/components/scheduling/types";

export function useTimeTracking(
  events: ScheduledEvent[],
  setEvents: React.Dispatch<React.SetStateAction<ScheduledEvent[]>>,
  selectedEvent: ScheduledEvent | null,
  setSelectedEvent: React.Dispatch<React.SetStateAction<ScheduledEvent | null>>
) {
  const { toast } = useToast();
  
  // Log additional time for a team member
  const handleLogTime = (eventId: string, teamMemberId: string, hours: number) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        const existingTimeTracking = event.timeTracking || [];
        const today = new Date().toISOString().split('T')[0];
        
        // Check if there's already a time entry for this team member today
        const existingEntryIndex = existingTimeTracking.findIndex(
          entry => entry.teamMemberId === teamMemberId && entry.date === today
        );
        
        if (existingEntryIndex >= 0) {
          // Update existing entry
          const updatedTimeTracking = [...existingTimeTracking];
          updatedTimeTracking[existingEntryIndex] = {
            ...updatedTimeTracking[existingEntryIndex],
            hoursLogged: updatedTimeTracking[existingEntryIndex].hoursLogged + hours
          };
          
          return {
            ...event,
            timeTracking: updatedTimeTracking
          };
        } else {
          // Add new entry
          return {
            ...event,
            timeTracking: [
              ...existingTimeTracking,
              {
                teamMemberId,
                hoursLogged: hours,
                date: today
              }
            ]
          };
        }
      }
      return event;
    }));
    
    // Update selected event if necessary
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent(events.find(e => e.id === eventId) || null);
    }
    
    toast({
      title: "Time Logged",
      description: `Successfully logged ${hours} hours.`,
    });
  };

  return { handleLogTime };
}
