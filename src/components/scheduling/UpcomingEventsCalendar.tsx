import { Card } from "@/components/ui/card";
import { ScheduledEvent } from "./types";
import { CalendarHeader } from "./calendar/CalendarHeader";
import { HourRangeSlider } from "./calendar/HourRangeSlider";
import { EventCards } from "./calendar/EventCards";
import { DayDetailView } from "./calendar/DayDetailView";
import { useCalendarEvents } from "./calendar/useCalendarEvents";

interface UpcomingEventsCalendarProps {
  events: ScheduledEvent[];
}

export function UpcomingEventsCalendar({ events }: UpcomingEventsCalendarProps) {
  // Use the custom hook to manage calendar state and logic
  const {
    selectedDate,
    setSelectedDate,
    weekDays,
    hourRange,
    setHourRange,
    processedEvents,
    dayEvents,
    navigatePreviousWeek,
    navigateNextWeek,
    getEventStatus,
  } = useCalendarEvents(events);
  
  return (
    <div className="space-y-6">
      <Card className="p-4 shadow-sm">
        {/* Calendar header with navigation and day selection */}
        <CalendarHeader 
          weekDays={weekDays}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          navigatePreviousWeek={navigatePreviousWeek}
          navigateNextWeek={navigateNextWeek}
        />
        
        {/* Hour Range Slider - keeping this for filtering events by time range */}
        <HourRangeSlider 
          hourRange={hourRange}
          setHourRange={setHourRange}
        />
        
        {/* Event cards display */}
        <EventCards 
          dayEvents={dayEvents}
          weekDays={weekDays}
          hourRange={hourRange}
          getEventStatus={getEventStatus}
        />
      </Card>
      
      {/* Day detail view showing events for the selected date */}
      <DayDetailView 
        selectedDate={selectedDate}
        processedEvents={processedEvents}
        getEventStatus={getEventStatus}
      />
    </div>
  );
}
