
import { ScheduledEvent, TeamMember, EventAssignment } from "@/components/scheduling/types";
import { useToast } from "@/components/ui/use-toast";

export function useSchedulingTab(
  events: ScheduledEvent[],
  setEvents: React.Dispatch<React.SetStateAction<ScheduledEvent[]>>,
  teamMembers: TeamMember[]
) {
  const { toast } = useToast();
  
  // Assignment counts function for the team assignments
  const getAssignmentCounts = (event: any) => {
    // Find team members for each assignment to determine their roles
    const assignments = event.assignments || [];
    
    const photographers = assignments.filter((a: any) => {
      const member = teamMembers.find(m => m.id === a.teamMemberId);
      return member?.role === "photographer";
    });
    
    const videographers = assignments.filter((a: any) => {
      const member = teamMembers.find(m => m.id === a.teamMemberId);
      return member?.role === "videographer";
    });
    
    return {
      acceptedPhotographers: photographers.filter((a: any) => a.status === "accepted").length,
      acceptedVideographers: videographers.filter((a: any) => a.status === "accepted").length,
      pendingPhotographers: photographers.filter((a: any) => a.status === "pending").length,
      pendingVideographers: videographers.filter((a: any) => a.status === "pending").length,
      totalPhotographers: event.photographersCount || 0,
      totalVideographers: event.videographersCount || 0
    };
  };
  
  // Handler for assignment
  const handleAssignTeamMemberForScheduling = (eventId: string, teamMemberId: string, role: string) => {
    const eventToUpdate = events.find(e => e.id === eventId);
    const teamMember = teamMembers.find(m => m.id === teamMemberId);
    
    if (eventToUpdate && teamMemberId && teamMember) {
      const newAssignment: EventAssignment = {
        eventId,
        teamMemberId,
        status: "pending",
        eventName: eventToUpdate.name,
        date: eventToUpdate.date,
        location: eventToUpdate.location,
        notes: `Assigned as ${role}`
      };
      
      const updatedAssignments = [...eventToUpdate.assignments, newAssignment];
      
      const updatedEvent = { ...eventToUpdate, assignments: updatedAssignments };
      const updatedEvents = events.map(e => e.id === eventId ? updatedEvent : e);
      setEvents(updatedEvents);
      
      toast({
        title: "Team member assigned",
        description: `${teamMember.name} has been notified about this assignment`
      });
    }
  };
  
  // Handler for updating assignment status
  const handleUpdateAssignmentStatus = (eventId: string, teamMemberId: string, status: "accepted" | "declined") => {
    const eventToUpdate = events.find(e => e.id === eventId);
    if (eventToUpdate) {
      const updatedAssignments = eventToUpdate.assignments.map(a => {
        if (a.teamMemberId === teamMemberId) {
          return { ...a, status };
        }
        return a;
      });
      
      const updatedEvent = { ...eventToUpdate, assignments: updatedAssignments };
      const updatedEvents = events.map(e => e.id === eventId ? updatedEvent : e);
      setEvents(updatedEvents);
      
      // Get team member and event details for notification
      const teamMember = teamMembers.find(t => t.id === teamMemberId);
      
      // Show toast notification
      toast({
        title: `Assignment ${status}`,
        description: teamMember ? 
          `${teamMember.name} has ${status} the assignment for ${eventToUpdate.name}` : 
          `Assignment for ${eventToUpdate.name} has been ${status}`
      });
    }
  };
  
  return {
    getAssignmentCounts,
    handleAssignTeamMemberForScheduling,
    handleUpdateAssignmentStatus
  };
}
