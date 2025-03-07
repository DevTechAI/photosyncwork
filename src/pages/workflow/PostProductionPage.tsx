
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { PostProductionDeliverables } from "@/components/workflow/post-production/PostProductionDeliverables";
import { PostProductionTimeTrackingTab } from "@/components/workflow/post-production/PostProductionTimeTrackingTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function PostProductionPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("deliverables");
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ScheduledEvent | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  
  // Load events and team members from localStorage on component mount
  useEffect(() => {
    // Load events
    const savedEvents = localStorage.getItem("scheduledEvents");
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents);
      const postProductionEvents = parsedEvents.filter(
        (event: ScheduledEvent) => event.stage === "post-production"
      );
      setEvents(postProductionEvents);
      if (postProductionEvents.length > 0) {
        setSelectedEvent(postProductionEvents[0]);
      }
    }
    
    // Load team members
    const savedTeamMembers = localStorage.getItem("teamMembers");
    if (savedTeamMembers) {
      setTeamMembers(JSON.parse(savedTeamMembers));
    }
  }, []);
  
  // Save events whenever they change
  useEffect(() => {
    if (events.length > 0) {
      // Get all other events that are not in post-production
      const savedEvents = localStorage.getItem("scheduledEvents");
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents);
        const otherEvents = parsedEvents.filter(
          (event: ScheduledEvent) => event.stage !== "post-production"
        );
        
        // Combine with post-production events
        const allEvents = [...otherEvents, ...events];
        localStorage.setItem("scheduledEvents", JSON.stringify(allEvents));
      }
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
  
  // Render event list
  const renderEventList = () => {
    return (
      <div className="space-y-2">
        <h3 className="font-medium">Post-Production Events</h3>
        {events.length === 0 ? (
          <p className="text-muted-foreground">No events in post-production</p>
        ) : (
          <div className="space-y-2">
            {events.map(event => (
              <Button
                key={event.id}
                variant={selectedEvent?.id === event.id ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setSelectedEvent(event)}
              >
                {event.name} - {new Date(event.date).toLocaleDateString()}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
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
            {renderEventList()}
          </div>
          
          <div className="lg:col-span-3">
            {selectedEvent ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-medium">{selectedEvent.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedEvent.date).toLocaleDateString()}
                  </p>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
                    <TabsTrigger value="time-tracking">Time Tracking</TabsTrigger>
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
                <p className="text-muted-foreground">Select an event to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
