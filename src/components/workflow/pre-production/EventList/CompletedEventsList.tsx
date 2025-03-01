
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { Calendar, MapPin, Trash2 } from "lucide-react";

interface CompletedEventsListProps {
  events: ScheduledEvent[];
  teamMembers: TeamMember[];
  onDelete: (id: string) => void;
}

export function CompletedEventsList({
  events,
  teamMembers,
  onDelete,
}: CompletedEventsListProps) {
  if (events.length === 0) {
    return (
      <div className="p-4 text-center border rounded-md">
        <p className="text-muted-foreground">No completed events</p>
      </div>
    );
  }

  // Function to get team member name by ID
  const getTeamMemberName = (id: string) => {
    const member = teamMembers.find(m => m.id === id);
    return member ? member.name : "Unknown";
  };

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id} className="p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h3 className="font-medium">{event.name}</h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(event.date).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              </div>
              
              {event.assignments && event.assignments.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium mb-1">Team:</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.assignments.map((assignment, idx) => {
                      const teamMember = teamMembers.find(m => m.id === assignment.teamMemberId);
                      return (
                        <div key={idx} className="text-xs px-2 py-1 bg-gray-100 rounded-full flex items-center gap-1">
                          <span>{getTeamMemberName(assignment.teamMemberId)}</span>
                          <span className={`ml-1 px-1.5 py-0.5 rounded-full text-white text-xs ${
                            assignment.status === 'accepted' ? 'bg-green-500' : 
                            assignment.status === 'declined' ? 'bg-red-500' : 
                            'bg-yellow-500'
                          }`}>
                            {assignment.status}
                          </span>
                          {teamMember && (
                            <span className="ml-1 text-muted-foreground">({teamMember.role})</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(event.id)}
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
