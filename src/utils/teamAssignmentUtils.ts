
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { useTeamNotifications } from "@/components/scheduling/utils/notificationHelpers";
import { useToast } from "@/components/ui/use-toast";

export function getAvailableTeamMembers(
  teamMembers: TeamMember[],
  selectedEvent: ScheduledEvent | null,
  role: "photographer" | "videographer"
) {
  return teamMembers.filter(
    tm => tm.role === role && 
    (!selectedEvent || !selectedEvent.assignments.some(a => a.teamMemberId === tm.id))
  );
}

export function getAssignedTeamMembers(
  selectedEvent: ScheduledEvent | null,
  teamMembers: TeamMember[]
) {
  return selectedEvent
    ? selectedEvent.assignments.map(assignment => {
        const teamMember = teamMembers.find(tm => tm.id === assignment.teamMemberId);
        return { 
          ...assignment, 
          teamMember 
        };
      })
    : [];
}

export function useTeamAssignmentHandlers(
  events: ScheduledEvent[],
  setEvents: React.Dispatch<React.SetStateAction<ScheduledEvent[]>>,
  selectedEvent: ScheduledEvent | null,
  setSelectedEvent: React.Dispatch<React.SetStateAction<ScheduledEvent | null>>,
  teamMembers: TeamMember[]
) {
  const { toast } = useToast();
  const { sendAssignmentNotification } = useTeamNotifications();
  const [loading, setLoading] = useState(false);

  const handleAssignTeamMember = async (teamMemberId: string, role: "photographer" | "videographer") => {
    if (!selectedEvent) return;
    
    setLoading(true);
    
    try {
      const teamMember = teamMembers.find(tm => tm.id === teamMemberId);
      if (!teamMember) throw new Error("Team member not found");
      
      // Create a new assignment
      const newAssignment = {
        eventId: selectedEvent.id,
        eventName: selectedEvent.name,
        date: selectedEvent.date,
        location: selectedEvent.location,
        teamMemberId,
        status: "pending" as const,
        reportingTime: selectedEvent.startTime
      };
      
      // Add assignment to the event
      const updatedEvent = {
        ...selectedEvent,
        assignments: [...selectedEvent.assignments, newAssignment]
      };
      
      // Update events state
      setEvents(prev => 
        prev.map(event => 
          event.id === selectedEvent.id ? updatedEvent : event
        )
      );
      
      setSelectedEvent(updatedEvent);
      
      // Send notification to team member
      await sendAssignmentNotification(updatedEvent, newAssignment, teamMember);
      
      toast({
        title: "Team Member Assigned",
        description: `${teamMember.name} has been assigned to the event and notified.`
      });
    } catch (error) {
      console.error("Error assigning team member:", error);
      toast({
        title: "Assignment Failed",
        description: "There was an error assigning the team member.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToProduction = () => {
    if (!selectedEvent) return;
    
    // Check if there are enough team members assigned
    const photographersAssigned = selectedEvent.assignments.filter(
      a => teamMembers.find(tm => tm.id === a.teamMemberId)?.role === "photographer"
    ).length;
    
    const videographersAssigned = selectedEvent.assignments.filter(
      a => teamMembers.find(tm => tm.id === a.teamMemberId)?.role === "videographer"
    ).length;
    
    if (
      photographersAssigned < selectedEvent.photographersCount ||
      videographersAssigned < selectedEvent.videographersCount
    ) {
      toast({
        title: "Insufficient Team Members",
        description: "Please assign the required number of team members before moving to production.",
        variant: "destructive"
      });
      return;
    }
    
    // Update event stage to production
    const updatedEvent = {
      ...selectedEvent,
      stage: "production" as const
    };
    
    // Update events state
    setEvents(prev => prev.filter(event => event.id !== selectedEvent.id));
    
    // Update all events in localStorage
    const savedEvents = localStorage.getItem("scheduledEvents");
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents);
      const updatedEvents = parsedEvents.map((event: ScheduledEvent) =>
        event.id === selectedEvent.id ? updatedEvent : event
      );
      localStorage.setItem("scheduledEvents", JSON.stringify(updatedEvents));
    }
    
    setSelectedEvent(null);
    
    toast({
      title: "Event Moved to Production",
      description: "The event has been moved to the production stage."
    });
  };

  return {
    loading,
    handleAssignTeamMember,
    handleMoveToProduction
  };
}
