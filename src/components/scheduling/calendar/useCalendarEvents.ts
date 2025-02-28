
import { useState, useEffect } from 'react';
import { ScheduledEvent } from "../types";
import { addDays, startOfWeek, endOfWeek, eachDayOfInterval, parseISO, isAfter } from 'date-fns';
import { processEventsWorkflow } from "@/utils/teamAssignmentUtils";

export function useCalendarEvents(events: ScheduledEvent[]) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [hourRange, setHourRange] = useState<[number, number]>([8, 18]); // Default 8am-6pm
  const [processedEvents, setProcessedEvents] = useState<ScheduledEvent[]>(events);
  
  // Process events on initial load and when events change
  useEffect(() => {
    // Process events through the workflow to update stages based on dates
    const updatedEvents = processEventsWorkflow(events);
    setProcessedEvents(updatedEvents);
  }, [events]);
  
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
  
  // Filter events for the selected week
  const dayEvents = processedEvents.filter(event => 
    weekDays.some(day => isSameDay(parseISO(event.date), day))
  );
  
  // Get event status based on date and stage
  const getEventStatus = (event: ScheduledEvent) => {
    const today = new Date();
    const eventDate = parseISO(event.date);
    
    if (isAfter(today, eventDate)) {
      return event.stage === "pre-production" ? "Pending Completion" : "Completed";
    }
    
    return event.stage === "pre-production" ? "Upcoming" : "In Progress";
  };

  return {
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
  };
}

import { isSameDay } from 'date-fns';
