
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { useTeamAssignmentHandlers } from "@/utils/teamAssignmentUtils";
import { useTeamMemberFiltering } from "./useTeamMemberFiltering";
import { useAssignmentStatusUpdater } from "./useAssignmentStatusUpdater";

export function useTeamAssignmentsTab(
  events: ScheduledEvent[],
  setEvents: React.Dispatch<React.SetStateAction<ScheduledEvent[]>>,
  selectedEvent: ScheduledEvent | null,
  setSelectedEvent: React.Dispatch<React.SetStateAction<ScheduledEvent | null>>,
  teamMembers: TeamMember[]
) {
  // Use our specialized hooks
  const { 
    loading, 
    handleAssignTeamMember, 
    handleMoveToProduction 
  } = useTeamAssignmentHandlers(events, setEvents, selectedEvent, setSelectedEvent, teamMembers);
  
  const {
    availablePhotographers,
    availableVideographers,
    assignedTeamMembers
  } = useTeamMemberFiltering(selectedEvent, teamMembers);
  
  const { handleUpdateAssignmentStatus } = useAssignmentStatusUpdater(
    events, 
    setEvents, 
    selectedEvent, 
    setSelectedEvent, 
    teamMembers
  );
  
  return {
    loading,
    availablePhotographers,
    availableVideographers,
    assignedTeamMembers,
    handleAssignTeamMember,
    handleMoveToProduction,
    handleUpdateAssignmentStatus
  };
}
