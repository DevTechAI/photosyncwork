
import { useState } from "react";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { useEventCreation } from "./useEventCreation";
import { useEventAssignment } from "./useEventAssignment";
import { useAssignmentStatus } from "./useAssignmentStatus";
import { useEventFiltering } from "./useEventFiltering";

export function useSchedulingPage(initialEvents: ScheduledEvent[], initialTeamMembers: TeamMember[]) {
  const [events, setEvents] = useState<ScheduledEvent[]>(initialEvents);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [mainTab, setMainTab] = useState("overview");
  
  // Use our split hooks
  const { 
    showCreateEventModal, 
    setShowCreateEventModal, 
    handleCreateEvent 
  } = useEventCreation();
  
  const { handleAssignTeamMember } = useEventAssignment(events, setEvents, teamMembers);
  
  const { handleUpdateAssignmentStatus } = useAssignmentStatus(events, setEvents, teamMembers);
  
  const { getAssignmentCounts, getEventsByStage } = useEventFiltering(events, teamMembers);

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
