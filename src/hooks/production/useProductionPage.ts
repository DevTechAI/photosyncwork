
import { useState } from "react";
import { useProductionEvents } from "./useProductionEvents";
import { useTeamMembers } from "./useTeamMembers";
import { useProductionTeamAssignment } from "./useProductionTeamAssignment";
import { useTimeTracking } from "./useTimeTracking";
import { useEventUpdates } from "./useEventUpdates";
import { useEventSync } from "./useEventSync";

export function useProductionPage() {
  const [activeTab, setActiveTab] = useState("tracking");
  
  // Use extracted hooks
  const { events, setEvents, selectedEvent, setSelectedEvent } = useProductionEvents();
  const { teamMembers } = useTeamMembers();
  
  // Hook for team assignments
  const { handleAssignTeamMember, handleUpdateAssignmentStatus } = useProductionTeamAssignment(
    events,
    setEvents,
    selectedEvent,
    setSelectedEvent
  );
  
  // Hook for event updates
  const { 
    handleUpdateEvent, 
    handleUpdateNotes, 
    handleMoveToPostProduction 
  } = useEventUpdates(events, setEvents, selectedEvent, setSelectedEvent);
  
  // Hook for time tracking
  const { handleLogTime } = useTimeTracking(events, setEvents, selectedEvent, setSelectedEvent);
  
  // Hook for syncing events with storage
  useEventSync(events);

  return {
    events,
    teamMembers,
    selectedEvent,
    setSelectedEvent,
    activeTab,
    setActiveTab,
    handleUpdateEvent,
    handleLogTime,
    handleUpdateNotes,
    handleMoveToPostProduction,
    handleAssignTeamMember,
    handleUpdateAssignmentStatus
  };
}
