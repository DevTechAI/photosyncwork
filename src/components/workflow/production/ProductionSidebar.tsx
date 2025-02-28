
import { ScheduledEvent } from "@/components/scheduling/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Clock, Calendar, Users } from "lucide-react";

interface ProductionSidebarProps {
  events: ScheduledEvent[];
}

export function ProductionSidebar({ events }: ProductionSidebarProps) {
  // Filter events to only show production events
  const productionEvents = events.filter(event => event.stage === "production");
  
  // Calculate total hours logged across all events
  const totalHoursLogged = productionEvents.reduce((total, event) => {
    if (!event.timeTracking) return total;
    return total + event.timeTracking.reduce((sum, log) => sum + log.hoursLogged, 0);
  }, 0);
  
  // Get today's date as a string (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];
  
  // Get this week's events
  const thisWeekEvents = productionEvents.filter(e => {
    const eventDate = new Date(e.date);
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (6 - now.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);
    
    return eventDate >= startOfWeek && eventDate <= endOfWeek;
  });
  
  // Get today's events
  const todayEvents = productionEvents.filter(event => event.date === today);
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Event Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Camera className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm">Total Events</span>
              </div>
              <span className="font-medium">{productionEvents.length}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm">This Week</span>
              </div>
              <span className="font-medium">{thisWeekEvents.length}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm">Total Hours</span>
              </div>
              <span className="font-medium">{totalHoursLogged}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Today's Shoots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayEvents.length > 0 ? (
              todayEvents.map(event => (
                <div key={event.id} className="space-y-2 pb-3 border-b last:border-b-0 last:pb-0">
                  <div className="font-medium text-sm">{event.name}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{event.startTime} - {event.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>
                      {event.photographersCount} Photographer{event.photographersCount !== 1 ? "s" : ""}, 
                      {event.videographersCount} Videographer{event.videographersCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No shoots scheduled today</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
