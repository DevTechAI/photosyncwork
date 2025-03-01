
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { CompletedEventsList } from "@/components/workflow/pre-production/EventList/CompletedEventsList";

interface CompletedPreProductionEventsProps {
  completedEvents: ScheduledEvent[];
  teamMembers: TeamMember[];
  onDelete: (eventId: string) => void;
}

export function CompletedPreProductionEvents({
  completedEvents,
  teamMembers,
  onDelete
}: CompletedPreProductionEventsProps) {
  return (
    <CompletedEventsList
      completedEvents={completedEvents}
      teamMembers={teamMembers}
      onDelete={onDelete}
    />
  );
}
