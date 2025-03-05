
import { ScheduledEvent, WorkflowStage } from "@/components/scheduling/types";

/**
 * Filter events by workflow stage
 */
export function getEventsByStage(events: ScheduledEvent[], stage: WorkflowStage) {
  return events.filter(event => event.stage === stage);
}
