
import { Card } from "@/components/ui/card";
import { TeamMember, ScheduledEvent } from "@/components/scheduling/types";

interface CompletedEventsListProps {
  completedEvents: ScheduledEvent[];
  teamMembers: TeamMember[];
  onDelete: (eventId: string) => void;
}

export function CompletedEventsList({
  completedEvents,
  teamMembers,
  onDelete
}: CompletedEventsListProps) {
  if (!completedEvents.length) return null;
  
  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium mb-4">Completed Pre-Production Events</h2>
      <div className="space-y-4">
        {completedEvents.map((event) => (
          <Card key={event.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{event.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(event.date).toLocaleDateString()}
                </p>
                
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">Team: </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {event.assignments.map((assignment) => {
                      const member = teamMembers.find(m => m.id === assignment.teamMemberId);
                      return member ? (
                        <span 
                          key={`${event.id}-${member.id}`}
                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          {member.name} ({assignment.role})
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => onDelete(event.id)}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
