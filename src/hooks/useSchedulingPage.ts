
import { useState } from "react";
import { ScheduledEvent, TeamMember, WorkflowStage } from "@/components/scheduling/types";

export function useSchedulingPage(initialEvents: ScheduledEvent[], initialTeamMembers: TeamMember[]) {
  const [events, setEvents] = useState<ScheduledEvent[]>(initialEvents);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [mainTab, setMainTab] = useState("overview");
  
  const handleCreateEvent = (newEvent: ScheduledEvent) => {
    setEvents(prev => [...prev, newEvent]);
    setShowCreateEventModal(false);
  };
  
  const handleAssignTeamMember = (eventId: string, teamMemberId: string, role: string) => {
    const event = events.find(e => e.id === eventId);
    const teamMember = teamMembers.find(t => t.id === teamMemberId);
    
    if (event && teamMember) {
      const newAssignment = {
        eventId,
        eventName: event.name,
        date: event.date,
        location: event.location,
        teamMemberId,
        status: "pending" as const,
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
      
      setEvents(updatedEvents);
    }
  };
  
  const handleUpdateAssignmentStatus = (eventId: string, teamMemberId: string, status: "accepted" | "declined") => {
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
    
    setEvents(updatedEvents);
  };

  // Get assignment counts by role and status
  const getAssignmentCounts = (event: ScheduledEvent) => {
    const acceptedPhotographers = event.assignments.filter(
      a => {
        const member = teamMembers.find(m => m.id === a.teamMemberId);
        return member?.role === "photographer" && a.status === "accepted";
      }
    ).length;

    const acceptedVideographers = event.assignments.filter(
      a => {
        const member = teamMembers.find(m => m.id === a.teamMemberId);
        return member?.role === "videographer" && a.status === "accepted";
      }
    ).length;

    const pendingPhotographers = event.assignments.filter(
      a => {
        const member = teamMembers.find(m => m.id === a.teamMemberId);
        return member?.role === "photographer" && a.status === "pending";
      }
    ).length;

    const pendingVideographers = event.assignments.filter(
      a => {
        const member = teamMembers.find(m => m.id === a.teamMemberId);
        return member?.role === "videographer" && a.status === "pending";
      }
    ).length;

    return {
      acceptedPhotographers,
      acceptedVideographers,
      pendingPhotographers,
      pendingVideographers,
      totalPhotographers: acceptedPhotographers + pendingPhotographers,
      totalVideographers: acceptedVideographers + pendingVideographers
    };
  };

  // Filter events by workflow stage
  const getEventsByStage = (stage: WorkflowStage) => {
    return events.filter(event => event.stage === stage);
  };
  
  return {
    events,
    setEvents,
    teamMembers,
    setTeamMembers,
    showCreateEventModal,
    setShowCreateEventModal,
    mainTab,
    setMainTab,
    handleCreateEvent,
    handleAssignTeamMember,
    handleUpdateAssignmentStatus,
    getAssignmentCounts,
    getEventsByStage
  };
}
