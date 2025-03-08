
import { useState, useEffect } from "react";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { dbToScheduledEvent, scheduledEventToDb } from "@/utils/supabaseConverters";

export function usePostProductionPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("deliverables");
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ScheduledEvent | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Load events and team members
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const { data: postProductionEvents, error: eventsError } = await supabase
          .from('scheduled_events')
          .select('*')
          .eq('stage', 'post-production');
          
        if (eventsError) {
          console.error("Error loading post-production events:", eventsError);
          throw eventsError;
        }
        
        if (postProductionEvents && postProductionEvents.length > 0) {
          const transformedEvents = postProductionEvents.map(event => 
            dbToScheduledEvent(event)
          ) as ScheduledEvent[];
          
          setEvents(transformedEvents);
          if (transformedEvents.length > 0 && !selectedEvent) {
            setSelectedEvent(transformedEvents[0]);
          }
        }
        
        const { data: teamMembersData, error: teamError } = await supabase
          .from('team_members')
          .select('*');
          
        if (teamError) {
          console.error("Error loading team members:", teamError);
        } else if (teamMembersData) {
          setTeamMembers(teamMembersData as TeamMember[]);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error Loading Data",
          description: "There was a problem loading your events and team members",
          variant: "destructive"
        });
        
        const savedEvents = localStorage.getItem("scheduledEvents");
        if (savedEvents) {
          const parsedEvents = JSON.parse(savedEvents);
          const postProductionEvents = parsedEvents.filter(
            (event: ScheduledEvent) => event.stage === "post-production"
          );
          setEvents(postProductionEvents);
          if (postProductionEvents.length > 0 && !selectedEvent) {
            setSelectedEvent(postProductionEvents[0]);
          }
        }
        
        const savedTeamMembers = localStorage.getItem("teamMembers");
        if (savedTeamMembers) {
          setTeamMembers(JSON.parse(savedTeamMembers));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast, selectedEvent]);
  
  // Save events whenever they change
  useEffect(() => {
    if (events.length > 0) {
      const saveEvents = async () => {
        try {
          for (const event of events) {
            const dbEvent = scheduledEventToDb(event);
            const { error } = await supabase
              .from('scheduled_events')
              .update(dbEvent)
              .eq('id', event.id);
              
            if (error) {
              console.error(`Error saving event ${event.id} to Supabase:`, error);
            }
          }
        } catch (error) {
          console.error("Error saving events to Supabase:", error);
        }
      };
      
      saveEvents();
    }
  }, [events]);
  
  // Update an event
  const handleUpdateEvents = (updatedEvent: ScheduledEvent) => {
    setEvents(prev => 
      prev.map(event => event.id === updatedEvent.id ? updatedEvent : event)
    );
    
    if (selectedEvent?.id === updatedEvent.id) {
      setSelectedEvent(updatedEvent);
    } else if (updatedEvent.stage !== "post-production") {
      setEvents(prev => prev.filter(event => event.id !== updatedEvent.id));
      if (selectedEvent?.id === updatedEvent.id) {
        setSelectedEvent(events.length > 1 ? events[0] : null);
      }
    }
  };
  
  // Log time for an event
  const handleLogTime = (teamMemberId: string, hours: number) => {
    if (!selectedEvent) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    const timeTracking = selectedEvent.timeTracking || [];
    
    const updatedEvent = {
      ...selectedEvent,
      timeTracking: [
        ...timeTracking,
        {
          teamMemberId,
          hoursLogged: hours,
          date: today
        }
      ]
    };
    
    handleUpdateEvents(updatedEvent);
    
    toast({
      title: "Time Logged",
      description: `Successfully logged ${hours} hours.`
    });
  };

  return {
    activeTab,
    setActiveTab,
    events,
    selectedEvent,
    setSelectedEvent,
    teamMembers,
    isLoading,
    isMobile,
    handleUpdateEvents,
    handleLogTime
  };
}
