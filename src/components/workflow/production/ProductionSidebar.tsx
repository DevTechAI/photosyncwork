
import { ScheduledEvent } from "@/components/scheduling/types";
import { Camera } from "lucide-react";

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
  
  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg">
        <h3 className="font-medium mb-4">Event Overview</h3>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm">Total Events</span>
            <span className="font-medium">{productionEvents.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">This Week</span>
            <span className="font-medium">
              {productionEvents.filter(e => {
                const eventDate = new Date(e.date);
                const now = new Date();
                const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
                return eventDate >= startOfWeek && eventDate <= endOfWeek;
              }).length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Total Hours Logged</span>
            <span className="font-medium">{totalHoursLogged}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 border rounded-lg">
        <h3 className="font-medium mb-4">Today's Shoots</h3>
        <div className="space-y-4">
          {productionEvents
            .filter(event => {
              const today = new Date().toISOString().split('T')[0];
              return event.date === today;
            })
            .map(event => (
              <div key={event.id} className="space-y-2 pb-2 border-b last:border-b-0">
                <p className="font-medium text-sm">{event.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Camera className="h-3 w-3" />
                  <span>{event.startTime} - {event.endTime}</span>
                </div>
              </div>
            ))}
          
          {productionEvents.filter(event => {
            const today = new Date().toISOString().split('T')[0];
            return event.date === today;
          }).length === 0 && (
            <p className="text-sm text-muted-foreground">No shoots scheduled today</p>
          )}
        </div>
      </div>
    </div>
  );
}
