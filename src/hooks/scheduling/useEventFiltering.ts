
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { getAssignmentCounts } from "@/utils/eventAssignmentUtils";
import { getEventsByStage as filterEventsByStage } from "@/utils/eventFilteringUtils";

export function useEventFiltering(events: ScheduledEvent[], teamMembers: TeamMember[]) {
  // Use utility function to get assignment counts
  const getEventAssignmentCounts = (event: ScheduledEvent) => {
    return getAssignmentCounts(event, teamMembers);
  };

  // Use utility function to filter events by stage
  const getEventsByStage = (stage: WorkflowStage) => {
    return filterEventsByStage(events, stage);
  };
  
  return {
    getAssignmentCounts: getEventAssignmentCounts,
    getEventsByStage
  };
}
