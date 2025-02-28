
import { ScheduledEvent } from "../types";
import { parseISO, isSameDay, format, isAfter } from "date-fns";

interface EventCardsProps {
  dayEvents: ScheduledEvent[];
  weekDays: Date[];
  hourRange: [number, number];
  getEventStatus: (event: ScheduledEvent) => string;
}

export function EventCards({ dayEvents, weekDays, hourRange, getEventStatus }: EventCardsProps) {
  return (
    <div className="space-y-4 mt-6">
      {dayEvents.map((event, eventIndex) => {
        const eventDate = parseISO(event.date);
        const dayIndex = weekDays.findIndex(day => isSameDay(day, eventDate));
        
        if (dayIndex === -1) return null; // Skip if not in current week
        
        // Check if event time is within the selected hour range
        const startHour = parseInt(event.startTime.split(':')[0]);
        const endHour = parseInt(event.endTime.split(':')[0]);
        
        if (startHour > hourRange[1] || endHour < hourRange[0]) return null;
        
        // Calculate which day column it belongs to
        const leftPosition = `${(dayIndex / 7) * 100}%`;
        
        // Randomly choose a color for the event
        const colors = ['blue', 'green', 'purple', 'indigo'];
        const colorIndex = Math.floor(event.id.charCodeAt(0) % colors.length);
        const borderColor = `border-${colors[colorIndex]}-500`;
        
        // Get status badge color
        const status = getEventStatus(event);
        const statusColor = 
          status === "Completed" ? "bg-green-100 text-green-800" :
          status === "In Progress" ? "bg-blue-100 text-blue-800" :
          status === "Pending Completion" ? "bg-yellow-100 text-yellow-800" :
          "bg-gray-100 text-gray-800";
        
        return (
          <div
            key={eventIndex}
            className={`p-3 rounded-md shadow-sm bg-white border-l-4 ${borderColor} mb-2`}
            style={{
              marginLeft: leftPosition,
              width: 'calc(100% / 7 - 8px)'
            }}
          >
            <div className="font-medium text-sm truncate">{event.name}</div>
            <div className="text-xs text-gray-500">{event.startTime} - {event.endTime}</div>
            <div className="text-xs text-gray-500 truncate">{event.location}</div>
            <div className={`mt-1 text-xs px-1.5 py-0.5 rounded-sm inline-block ${statusColor}`}>
              {status}
            </div>
          </div>
        );
      })}
      
      {dayEvents.length === 0 && (
        <div className="text-center p-4 text-gray-500">
          No events scheduled for this week
        </div>
      )}
    </div>
  );
}
