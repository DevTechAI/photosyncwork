
import { Calendar, MapPin } from "lucide-react";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";

interface WorkflowSidebarProps {
  events: ScheduledEvent[];
  teamMembers: TeamMember[];
  getEventsByStage: (stage: "pre-production" | "production" | "post-production" | "completed") => ScheduledEvent[];
}

export function WorkflowSidebar({ events, teamMembers, getEventsByStage }: WorkflowSidebarProps) {
  // Get upcoming events (today or future)
  const getUpcomingEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return events
      .filter(event => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  };
  
  const upcomingEvents = getUpcomingEvents();
  
  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg">
        <h3 className="font-medium mb-4">Workflow Overview</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span className="text-sm">Pre-Production</span>
            </div>
            <span className="font-medium">{getEventsByStage("pre-production").length}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm">Production</span>
            </div>
            <span className="font-medium">{getEventsByStage("production").length}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Post-Production</span>
            </div>
            <span className="font-medium">{getEventsByStage("post-production").length}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 border rounded-lg">
        <h3 className="font-medium mb-4">Upcoming Events</h3>
        <div className="space-y-4">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(event => (
              <div key={event.id} className="space-y-2 pb-2 border-b last:border-b-0">
                <p className="font-medium text-sm">{event.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No upcoming events scheduled</p>
          )}
        </div>
      </div>
      
      <div className="p-4 border rounded-lg">
        <h3 className="font-medium mb-4">Team Availability</h3>
        {teamMembers.length > 0 ? (
          <div className="space-y-2">
            {teamMembers.map(member => (
              <div key={member.id} className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  member.availability[new Date().toISOString().split('T')[0]] === 'available' 
                    ? 'bg-green-500' 
                    : member.availability[new Date().toISOString().split('T')[0]] === 'busy' 
                      ? 'bg-red-500' 
                      : 'bg-yellow-500'
                }`} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No team members available</p>
        )}
      </div>
    </div>
  );
}
