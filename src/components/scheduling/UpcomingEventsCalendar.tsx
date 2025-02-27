
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-4 md:col-span-1 h-fit">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md"
          modifiers={{
            booked: datesWithEvents
          }}
          modifiersClassNames={{
            booked: 'border border-blue-500 bg-blue-50'
          }}
        />
      </Card>
      
      <Card className="p-4 md:col-span-2">
        <h3 className="font-medium mb-4">
          {date ? date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Select a date'}
        </h3>
        
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {selectedDateEvents.length > 0 ? (
            selectedDateEvents.map(event => (
              <div key={event.id} className="p-3 border rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{event.name}</h4>
                    <p className="text-sm text-muted-foreground">{event.startTime} - {event.endTime}</p>
                  </div>
                  <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
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
