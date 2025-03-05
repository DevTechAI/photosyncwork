
import { useState, useEffect } from "react";
import { ScheduledEvent } from "@/components/scheduling/types";
import { useToast } from "@/components/ui/use-toast";
import { createEventsFromApprovedEstimates, getEventsByStage, getAllEvents } from "@/components/scheduling/utils/eventHelpers";
import { processEventsWorkflow } from "@/utils/workflowProcessUtils";

export function useEventLoader() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [preProductionEvents, setPreProductionEvents] = useState<ScheduledEvent[]>([]);
  const [completedEvents, setCompletedEvents] = useState<ScheduledEvent[]>([]);
  
  // Load events on mount
  useEffect(() => {
    loadEvents();
  }, [toast]);
  
  const loadEvents = async () => {
    setIsLoading(true);
    
    try {
      // First, check for any approved estimates that need to be converted to events
      const newEvents = await createEventsFromApprovedEstimates();
      
      if (newEvents.length > 0) {
        toast({
          title: "New Events Created",
          description: `${newEvents.length} new event(s) created from approved estimates.`
        });
      }
      
      // Get all pre-production events
      let preProductionEvents = await getEventsByStage("pre-production");
      
      // Get events that were previously in pre-production but have moved to production
      const allEvents = await getAllEvents();
      const movedEvents = allEvents.filter(event => 
        event.stage === "production" && 
        event.dataCopied === true
      );
      
      // Process events based on dates - this will move events to the next stage if needed
      preProductionEvents = processEventsWorkflow(preProductionEvents);
      
      // Set pre-production events in the state
      setPreProductionEvents(preProductionEvents);
      setCompletedEvents(movedEvents);
    } catch (error) {
      console.error("Error loading events:", error);
      toast({
        title: "Error Loading Events",
        description: "There was a problem loading your events",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    preProductionEvents,
    completedEvents,
    setPreProductionEvents,
    setCompletedEvents,
    loadEvents
  };
}
