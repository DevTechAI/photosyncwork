
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, MapPin, Users, CheckCircle, XCircle } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  // Helper to get team member name by ID
  const getTeamMemberName = (id: string) => {
    const member = teamMembers.find(m => m.id === id);
    return member ? member.name : "Unknown";
  };

  // Helper to get team member role by ID
  const getTeamMemberRole = (id: string) => {
    const member = teamMembers.find(m => m.id === id);
    return member ? member.role : "unknown";
  };

  if (completedEvents.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">No completed pre-production events found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Completed Pre-Production Events</h2>
      <p className="text-sm text-muted-foreground">
        These events have been moved to production but their details are kept for reference
      </p>
      
      <Accordion type="single" collapsible className="w-full">
        {completedEvents.map((event) => (
          <AccordionItem key={event.id} value={event.id}>
            <AccordionTrigger className="px-4 py-2 bg-slate-50 rounded-md">
              <div className="flex items-center justify-between w-full">
                <div className="text-left">
                  <span className="font-medium">{event.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-2">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {event.photographersCount} Photographers, {event.videographersCount} Videographers
                    </span>
                  </div>
                </div>
                
                {/* Client Requirements */}
                <div className="border-t pt-2">
                  <h3 className="text-sm font-medium mb-1">Client Requirements</h3>
                  <p className="text-sm">
                    {event.clientRequirements || "No specific requirements were added"}
                  </p>
                </div>
                
                {/* Assigned Team */}
                <div className="border-t pt-2">
                  <h3 className="text-sm font-medium mb-1">Assigned Team</h3>
                  {event.assignments && event.assignments.length > 0 ? (
                    <div className="space-y-2">
                      {event.assignments.map((assignment, index) => (
                        <div key={index} className="flex justify-between items-center p-2 rounded-md bg-gray-50">
                          <div>
                            <span className="text-sm font-medium">{getTeamMemberName(assignment.teamMemberId)}</span>
                            <span className="text-xs text-muted-foreground ml-2 capitalize">
                              ({getTeamMemberRole(assignment.teamMemberId)})
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {assignment.status === 'accepted' ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : assignment.status === 'declined' ? (
                              <XCircle className="h-4 w-4 text-red-500" />
                            ) : (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                                {assignment.status}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No team members were assigned</p>
                  )}
                </div>
                
                {/* Delete Button */}
                <div className="flex justify-end pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onDelete(event.id)}
                    className="text-red-500 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Reference
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
