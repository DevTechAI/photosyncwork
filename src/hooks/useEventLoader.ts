
import { useState, useEffect } from "react";
import { ScheduledEvent } from "@/components/scheduling/types";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { dbToScheduledEvent } from "@/utils/supabaseConverters";
import { processEventsWorkflow } from "@/utils/workflowProcessUtils";

export function useEventLoader() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [preProductionEvents, setPreProductionEvents] = useState<ScheduledEvent[]>([]);
  const [completedEvents, setCompletedEvents] = useState<ScheduledEvent[]>([]);
  
  // Load events on mount
  useEffect(() => {
    loadEvents();
  }, []);
  
  const loadEvents = async () => {
    setIsLoading(true);
    
    try {
      // Get pre-production events from Supabase
      const { data: preProductionData, error: preProductionError } = await supabase
        .from('scheduled_events')
        .select('*')
        .eq('stage', 'pre-production');
      
      if (preProductionError) {
        console.error("Error loading pre-production events:", preProductionError);
        toast({
          title: "Error Loading Events",
          description: "There was a problem loading your events",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // Get completed events from Supabase
      const { data: completedData, error: completedError } = await supabase
        .from('scheduled_events')
        .select('*')
        .eq('stage', 'production')
        .eq('datacopied', true);
      
      if (completedError) {
        console.error("Error loading completed events:", completedError);
      }
      
      // Convert to frontend models
      let preProductionEvents = (preProductionData || []).map(record => dbToScheduledEvent(record));
      const completedEvents = (completedData || []).map(record => dbToScheduledEvent(record));
      
      // Process events based on dates - this will move events to the next stage if needed
      preProductionEvents = processEventsWorkflow(preProductionEvents);
      
      // Set in state
      setPreProductionEvents(preProductionEvents);
      setCompletedEvents(completedEvents);
    } catch (error) {
      console.error("Error in loadEvents:", error);
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
