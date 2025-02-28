
import { Card } from "@/components/ui/card";
import { ScheduledEvent } from "../types";
import { parseISO, isSameDay, format } from "date-fns";

interface DayDetailViewProps {
  selectedDate: Date;
  processedEvents: ScheduledEvent[];
  getEventStatus: (event: ScheduledEvent) => string;
}

export function DayDetailView({ selectedDate, processedEvents, getEventStatus }: DayDetailViewProps) {
  return (
    <Card className="p-4 shadow-sm">
      <h3 className="font-medium mb-4">
        {format(selectedDate, 'EEEE, MMMM d, yyyy')}
      </h3>
      
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {processedEvents
          .filter(event => isSameDay(parseISO(event.date), selectedDate))
          .map(event => {
            const status = getEventStatus(event);
            const statusColor = 
              status === "Completed" ? "bg-green-100 text-green-800" :
              status === "In Progress" ? "bg-blue-100 text-blue-800" :
              status === "Pending Completion" ? "bg-yellow-100 text-yellow-800" :
              "bg-gray-100 text-gray-800";
              
            return (
              <div key={event.id} className="p-3 border border-gray-100 rounded-md hover:bg-gray-50 transition-colors duration-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{event.name}</h4>
                    <p className="text-sm text-muted-foreground">{event.startTime} - {event.endTime}</p>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {event.photographersCount} P, {event.videographersCount} V
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${statusColor}`}>
                      {status}
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <p>{event.location}</p>
                  <p className="text-muted-foreground mt-1">Client: {event.clientName}</p>
                </div>
              </div>
            );
          })}
        
        {processedEvents.filter(event => isSameDay(parseISO(event.date), selectedDate)).length === 0 && (
          <div className="text-center p-6">
            <p className="text-muted-foreground">No events scheduled for this date</p>
          </div>
        )}
      </div>
    </Card>
  );
}
