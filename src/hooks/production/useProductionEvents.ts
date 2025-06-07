
import { useState, useEffect } from "react";
import { ScheduledEvent } from "@/components/scheduling/types";
import { supabase } from "@/integrations/supabase/client";
import { dbToScheduledEvent } from "@/utils/supabaseConverters";

export function useProductionEvents() {
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ScheduledEvent | null>(null);
  const [loading, setLoading] = useState(true);

  // Load events from Supabase or localStorage
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        console.log("Loading production events from Supabase...");
        
        // Try to load from Supabase first
        const { data: productionEvents, error } = await supabase
          .from('scheduled_events')
          .select('*')
          .eq('stage', 'production');
          
        if (error) {
          console.error("Error loading events from Supabase:", error);
          throw error;
        }
        
        if (productionEvents && productionEvents.length > 0) {
          console.log("Loaded production events from Supabase:", productionEvents);
          // Transform data using the proper converter function
          const transformedEvents = productionEvents.map(event => dbToScheduledEvent(event)) as ScheduledEvent[];
          
          setEvents(transformedEvents);
        } else {
          console.log("No production events found in Supabase, checking localStorage...");
          
          // Fallback to localStorage
          const savedEvents = localStorage.getItem("scheduledEvents");
          if (savedEvents) {
            const parsedEvents = JSON.parse(savedEvents);
            // Filter only production events
            const productionEvents = parsedEvents.filter(
              (event: ScheduledEvent) => event.stage === "production"
            );
            console.log("Found production events in localStorage:", productionEvents);
            setEvents(productionEvents);
          } else {
            console.log("No events found in localStorage either");
            setEvents([]);
          }
        }
      } catch (error) {
        console.error("Error loading events:", error);
        
        // Fallback to localStorage
        const savedEvents = localStorage.getItem("scheduledEvents");
        if (savedEvents) {
          const parsedEvents = JSON.parse(savedEvents);
          // Filter only production events
          const productionEvents = parsedEvents.filter(
            (event: ScheduledEvent) => event.stage === "production"
          );
          setEvents(productionEvents);
        }
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
    
    // Set up a periodic refresh to check for new production events
    const interval = setInterval(loadEvents, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  return {
    events,
    setEvents,
    selectedEvent,
    setSelectedEvent,
    loading
  };
}
