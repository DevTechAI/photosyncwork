
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { ScheduledEvent } from "./types";
import { useState } from "react";

interface UpcomingEventsCalendarProps {
  events: ScheduledEvent[];
}

export function UpcomingEventsCalendar({ events }: UpcomingEventsCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Find events for the selected date
  const selectedDateEvents = date
    ? events.filter(event => event.date === date.toISOString().split('T')[0])
    : [];
  
  // Create dates with events for highlighting in calendar
  const datesWithEvents = events.map(event => new Date(event.date));
  
  return (
    <div className="space-y-6">
      <Card className="p-4 shadow-sm">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="mx-auto"
          modifiers={{
            booked: datesWithEvents
          }}
          modifiersClassNames={{
            booked: 'font-medium text-blue-600 bg-blue-50/70'
          }}
          styles={{
            month: { width: '100%' },
            caption_label: { textTransform: 'uppercase', fontSize: '0.875rem', fontWeight: 500 },
            table: { width: '100%', borderSpacing: '0.5rem', borderCollapse: 'separate' },
            head_cell: { textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 500, opacity: 0.6 },
            cell: { width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem' },
            day: { width: '2.5rem', height: '2.5rem', fontSize: '0.875rem', borderRadius: '0.5rem' }
          }}
        />
      </Card>
      
      <Card className="p-4 shadow-sm">
        <h3 className="font-medium mb-4">
          {date ? date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Select a date'}
        </h3>
        
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {selectedDateEvents.length > 0 ? (
            selectedDateEvents.map(event => (
              <div key={event.id} className="p-3 border border-gray-100 rounded-md hover:bg-gray-50 transition-colors duration-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{event.name}</h4>
                    <p className="text-sm text-muted-foreground">{event.startTime} - {event.endTime}</p>
                  </div>
                  <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    {event.photographersCount} P, {event.videographersCount} V
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <p>{event.location}</p>
                  <p className="text-muted-foreground mt-1">Client: {event.clientName}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-6">
              <p className="text-muted-foreground">No events scheduled for this date</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
