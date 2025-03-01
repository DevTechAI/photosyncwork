
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";

export function useSchedulingTab(
  events: ScheduledEvent[],
  setEvents: React.Dispatch<React.SetStateAction<ScheduledEvent[]>>,
  teamMembers: TeamMember[]
) {
  // Assignment counts function for the team assignments
  const getAssignmentCounts = (event: any) => {
    const photographers = event.assignments?.filter((a: any) => a.role === "photographer") || [];
    const videographers = event.assignments?.filter((a: any) => a.role === "videographer") || [];
    
    return {
      acceptedPhotographers: photographers.filter((a: any) => a.status === "accepted").length,
      acceptedVideographers: videographers.filter((a: any) => a.status === "accepted").length,
      pendingPhotographers: photographers.filter((a: any) => a.status === "pending").length,
      pendingVideographers: videographers.filter((a: any) => a.status === "pending").length,
      totalPhotographers: event.requiredPhotographers || 0,
      totalVideographers: event.requiredVideographers || 0
    };
  };
  
  // Handler for assignment
  const handleAssignTeamMemberForScheduling = (eventId: string, teamMemberId: string, role: string) => {
    const eventToUpdate = events.find(e => e.id === eventId);
    if (eventToUpdate && teamMemberId && role) {
      const updatedAssignments = [...eventToUpdate.assignments, {
        eventId,
        teamMemberId,
        role,
        status: "pending",
        eventName: eventToUpdate.name,
        date: eventToUpdate.date,
        location: eventToUpdate.location,
        notes: `Assigned as ${role}`
      }];
      
      const updatedEvent = { ...eventToUpdate, assignments: updatedAssignments };
      const updatedEvents = events.map(e => e.id === eventId ? updatedEvent : e);
      setEvents(updatedEvents);
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
    }
  };
  
  return {
    getAssignmentCounts,
    handleAssignTeamMemberForScheduling,
    handleUpdateAssignmentStatus
  };
}
