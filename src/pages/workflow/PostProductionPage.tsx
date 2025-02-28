
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Film } from "lucide-react";
import { useState, useEffect } from "react";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { PostProductionEventList } from "@/components/workflow/post-production/PostProductionEventList";
import { PostProductionEventDetails } from "@/components/workflow/post-production/PostProductionEventDetails";
import { PostProductionDeliverables } from "@/components/workflow/post-production/PostProductionDeliverables";

export default function PostProductionPage() {
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ScheduledEvent | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  
  // Load events and team members from localStorage on mount
  useEffect(() => {
    // Load events
    const savedEvents = localStorage.getItem("scheduledEvents");
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents);
      // Filter only post-production events
      const postProductionEvents = parsedEvents.filter(
        (event: ScheduledEvent) => event.stage === "post-production"
      );
      setEvents(postProductionEvents);
    }
    
    // Load team members
    const savedTeamMembers = localStorage.getItem("teamMembers");
    if (savedTeamMembers) {
      setTeamMembers(JSON.parse(savedTeamMembers));
    }
  }, []);
  
  // Save events to localStorage whenever they change
  useEffect(() => {
    if (events.length > 0) {
      // Get all existing events first
      const savedEvents = localStorage.getItem("scheduledEvents");
      let allEvents: ScheduledEvent[] = [];
      
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents);
        // Filter out post-production events that are already in our state
        allEvents = parsedEvents.filter(
          (event: ScheduledEvent) => 
            event.stage !== "post-production" || 
            !events.some(e => e.id === event.id)
        );
      }
      
      // Add our post-production events
      localStorage.setItem("scheduledEvents", JSON.stringify([...allEvents, ...events]));
    }
  }, [events]);
  
  // Handler to update events
  const updateEvents = (updatedEvent: ScheduledEvent) => {
    if (updatedEvent.stage === "completed") {
      // Remove from post-production events if completed
      setEvents(prev => prev.filter(event => event.id !== updatedEvent.id));
    } else {
      // Update the event in our events array
      setEvents(prev => 
        prev.map(event => 
          event.id === updatedEvent.id ? updatedEvent : event
        )
      );
    }
    
    // If the updated event is the selected one, update that too
    if (selectedEvent && selectedEvent.id === updatedEvent.id) {
      setSelectedEvent(updatedEvent.stage === "completed" ? null : updatedEvent);
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Post-Production</h1>
            <p className="text-sm text-muted-foreground">
              Manage editing, deliverables, and client revisions
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Event List */}
          <div className="lg:col-span-1">
            <PostProductionEventList 
              events={events} 
              selectedEvent={selectedEvent} 
              setSelectedEvent={setSelectedEvent} 
            />
          </div>
          
          {/* Event Details and Deliverables */}
          <div className="lg:col-span-2">
            {selectedEvent ? (
              <div className="space-y-4">
                <PostProductionEventDetails 
                  selectedEvent={selectedEvent} 
                  setSelectedEvent={setSelectedEvent}
                  updateEvents={updateEvents}
                />
                
                {selectedEvent.dataCopied && (
                  <PostProductionDeliverables 
                    selectedEvent={selectedEvent} 
                    setSelectedEvent={setSelectedEvent}
                    updateEvents={updateEvents}
                    teamMembers={teamMembers}
                  />
                )}
              </div>
            ) : (
              <div className="border rounded-lg p-12 text-center">
                <Film className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Select an Event</h3>
                <p className="text-muted-foreground mt-1">
                  Select an event from the list to manage post-production tasks
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
