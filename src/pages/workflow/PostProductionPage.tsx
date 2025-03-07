
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { PostProductionDeliverables } from "@/components/workflow/post-production/PostProductionDeliverables";
import { PostProductionTimeTrackingTab } from "@/components/workflow/post-production/PostProductionTimeTrackingTab";
import { PostProductionEventList } from "@/components/workflow/post-production/PostProductionEventList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { dbToScheduledEvent, scheduledEventToDb } from "@/utils/supabaseConverters";

export default function PostProductionPage() {
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
        // Load post-production events from Supabase
        const { data: postProductionEvents, error: eventsError } = await supabase
          .from('scheduled_events')
          .select('*')
          .eq('stage', 'post-production');
          
        if (eventsError) {
          console.error("Error loading post-production events:", eventsError);
          throw eventsError;
        }
        
        if (postProductionEvents && postProductionEvents.length > 0) {
          // Transform data using converter
          const transformedEvents = postProductionEvents.map(event => 
            dbToScheduledEvent(event)
          ) as ScheduledEvent[];
          
          setEvents(transformedEvents);
          if (transformedEvents.length > 0 && !selectedEvent) {
            setSelectedEvent(transformedEvents[0]);
          }
        }
        
        // Load team members
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
        
        // Fallback to localStorage
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
      // If the event is moved to another stage, remove it from the list
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
    
    // Create a timeTracking entry if it doesn't exist
    const timeTracking = selectedEvent.timeTracking || [];
    
    // Add the new time entry
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
    
    // Update the events state
    handleUpdateEvents(updatedEvent);
    
    toast({
      title: "Time Logged",
      description: `Successfully logged ${hours} hours.`
    });
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Post-Production</h1>
          <p className="text-sm text-muted-foreground">
            Manage deliverables and track editing time
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1">
            <PostProductionEventList
              events={events}
              selectedEvent={selectedEvent}
              onSelectEvent={setSelectedEvent}
            />
          </div>
          
          <div className="lg:col-span-3">
            {selectedEvent ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center flex-wrap">
                  <div>
                    <h2 className="text-xl font-medium">{selectedEvent.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      Client: {selectedEvent.clientName} | {new Date(selectedEvent.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full flex mb-4">
                    <TabsTrigger value="deliverables" className="flex-1">Deliverables</TabsTrigger>
                    <TabsTrigger value="time-tracking" className="flex-1">Time Tracking</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="deliverables" className="pt-4">
                    <PostProductionDeliverables
                      selectedEvent={selectedEvent}
                      setSelectedEvent={setSelectedEvent}
                      updateEvents={handleUpdateEvents}
                      teamMembers={teamMembers}
                    />
                  </TabsContent>
                  
                  <TabsContent value="time-tracking" className="pt-4">
                    <PostProductionTimeTrackingTab
                      event={selectedEvent}
                      teamMembers={teamMembers}
                      onLogTime={handleLogTime}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 bg-muted rounded-md">
                <p className="text-muted-foreground">
                  {isLoading ? "Loading events..." : "Select an event to view details"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
