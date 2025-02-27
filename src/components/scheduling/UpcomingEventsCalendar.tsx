import { Card } from "@/components/ui/card";
import { ScheduledEvent } from "./types";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from "date-fns";
import { Slider } from "@/components/ui/slider";

interface UpcomingEventsCalendarProps {
  events: ScheduledEvent[];
}

export function UpcomingEventsCalendar({ events }: UpcomingEventsCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [hourRange, setHourRange] = useState<[number, number]>([8, 18]); // Default 8am-6pm
  
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
    
    // If event is outside our hour range, don't render it
    if (startHour > hourRange[1] || endHour < hourRange[0]) return null;
    
    // Calculate positions relative to our hour range
    const startPosition = Math.max(0, (startHour - hourRange[0]) * 60 + startMinute);
    const duration = (Math.min(hourRange[1], endHour) - Math.max(hourRange[0], startHour)) * 60 + 
                     (endHour <= hourRange[1] ? endMinute : 0) - 
                     (startHour >= hourRange[0] ? startMinute : 0);
    
    // Find which day column it belongs to
    const eventDate = parseISO(event.date);
    const dayIndex = weekDays.findIndex(day => isSameDay(day, eventDate));
    
    // If event falls outside our week view, don't render it
    if (dayIndex === -1) return null;
    
    // Calculate left position based on day and top position based on time
    const leftPosition = `calc(${(dayIndex / 7) * 100}% + 1rem)`;
    const width = `calc(${(1 / 7) * 100}% - 1.5rem)`;
    
    // Scale the position based on our visible hour range
    const hourHeight = 60; // 60px per hour
    const visibleHours = hourRange[1] - hourRange[0];
    const scaledHourHeight = 14 * 60 / visibleHours; // 14 is the default height of each hour slot
    
    const topPosition = `${startPosition * (scaledHourHeight / 60)}px`;
    const height = `${Math.max(duration * (scaledHourHeight / 60), 30)}px`;
    
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
        
        {/* Hour Range Slider - keeping this for filtering events by time range */}
        <div className="mt-4 mb-8 px-6">
          <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
            <span>Hour Range</span>
            <span>{hourRange[0]}:00 - {hourRange[1]}:00</span>
          </div>
          <Slider 
            defaultValue={[8, 18]} 
            min={0} 
            max={24} 
            step={1}
            value={[hourRange[0], hourRange[1]]}
            onValueChange={(values) => setHourRange([values[0], values[1]])}
            className="py-2"
          />
        </div>
        
        {/* Event cards instead of time grid */}
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
              </div>
            );
          })}
          
          {dayEvents.length === 0 && (
            <div className="text-center p-4 text-gray-500">
              No events scheduled for this week
            </div>
          )}
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
