
import { Card } from "@/components/ui/card";
import { ScheduledEvent } from "./types";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from "date-fns";

interface UpcomingEventsCalendarProps {
  events: ScheduledEvent[];
}

export function UpcomingEventsCalendar({ events }: UpcomingEventsCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  
  // Update week days when selected date changes
  useEffect(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Start on Monday
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 }); // End on Sunday
    const days = eachDayOfInterval({ start, end });
    setWeekDays(days);
  }, [selectedDate]);
  
  // Navigate to previous/next week
  const navigatePreviousWeek = () => {
    setSelectedDate(prev => addDays(prev, -7));
  };
  
  const navigateNextWeek = () => {
    setSelectedDate(prev => addDays(prev, 7));
  };
  
  // Time slots for the day view
  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  
  // Filter events for the selected day
  const dayEvents = events.filter(event => 
    weekDays.some(day => isSameDay(parseISO(event.date), day))
  );
  
  // Helper to determine event position and width based on time
  const getEventStyle = (event: ScheduledEvent) => {
    // Convert event times to positions
    const startHour = parseInt(event.startTime.split(':')[0]);
    const startMinute = parseInt(event.startTime.split(':')[1]);
    const endHour = parseInt(event.endTime.split(':')[0]);
    const endMinute = parseInt(event.endTime.split(':')[1]);
    
    const startPosition = (startHour - 8) * 60 + startMinute; // 8:00 is our first timeslot
    const duration = (endHour - startHour) * 60 + (endMinute - startMinute);
    
    // Find which day column it belongs to
    const eventDate = parseISO(event.date);
    const dayIndex = weekDays.findIndex(day => isSameDay(day, eventDate));
    
    // If event falls outside our week view, don't render it
    if (dayIndex === -1) return null;
    
    // Calculate left position based on day and top position based on time
    const leftPosition = `calc(${(dayIndex / 7) * 100}% + 1rem)`;
    const width = `calc(${(1 / 7) * 100}% - 1.5rem)`;
    const topPosition = `${startPosition + 60}px`;
    const height = `${Math.max(duration, 60)}px`;
    
    // Randomly choose a color for the event
    const colors = ['blue', 'green', 'purple', 'indigo'];
    const colorIndex = Math.floor(event.id.charCodeAt(0) % colors.length);
    const color = colors[colorIndex];
    
    return {
      left: leftPosition,
      width,
      top: topPosition,
      height,
      color
    };
  };
  
  return (
    <div className="space-y-6">
      <Card className="p-4 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={navigatePreviousWeek}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <h2 className="text-xl font-medium">
            {format(weekDays[0] || new Date(), 'MMMM yyyy')}
          </h2>
          
          <button 
            onClick={navigateNextWeek}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        
        {/* Days of the week */}
        <div className="grid grid-cols-7 mb-4">
          {weekDays.map((day, index) => {
            const isSelected = isSameDay(day, selectedDate);
            return (
              <div 
                key={index} 
                className="text-center cursor-pointer"
                onClick={() => setSelectedDate(day)}
              >
                <div className="text-sm text-gray-500 font-medium">
                  {format(day, 'EEE')}
                </div>
                <div 
                  className={`
                    rounded-full mx-auto w-10 h-10 flex items-center justify-center mt-1
                    ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}
                  `}
                >
                  {format(day, 'd')}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Time grid */}
        <div className="relative mt-8" style={{ height: '700px' }}>
          {/* Time labels */}
          <div className="absolute left-0 top-0 z-10 w-16">
            {timeSlots.map((time, index) => (
              <div 
                key={index} 
                className="text-xs text-gray-500 h-14 -mt-2"
              >
                {time}
              </div>
            ))}
          </div>
          
          {/* Grid lines */}
          <div className="absolute left-16 right-0 top-0 bottom-0">
            {timeSlots.map((_, index) => (
              <div 
                key={index} 
                className="border-t border-gray-100 h-14 w-full"
              />
            ))}
            
            {/* Vertical day separators */}
            <div className="grid grid-cols-7 h-full absolute top-0 left-0 right-0">
              {weekDays.map((_, index) => (
                <div key={index} className="border-r border-gray-100 h-full last:border-r-0" />
              ))}
            </div>
            
            {/* Events */}
            {dayEvents.map((event, index) => {
              const style = getEventStyle(event);
              if (!style) return null;
              
              return (
                <div
                  key={index}
                  className={`absolute rounded-md p-2 shadow-sm bg-white border-l-4 border-${style.color}-500 overflow-hidden`}
                  style={{
                    left: style.left,
                    width: style.width,
                    top: style.top,
                    height: style.height
                  }}
                >
                  <div className="font-medium text-sm truncate">{event.name}</div>
                  <div className="text-xs text-gray-500 truncate">{event.location}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
      
      <Card className="p-4 shadow-sm">
        <h3 className="font-medium mb-4">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h3>
        
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {events
            .filter(event => isSameDay(parseISO(event.date), selectedDate))
            .map(event => (
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
            ))}
          
          {events.filter(event => isSameDay(parseISO(event.date), selectedDate)).length === 0 && (
            <div className="text-center p-6">
              <p className="text-muted-foreground">No events scheduled for this date</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
