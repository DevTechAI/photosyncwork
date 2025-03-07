import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { ProductionSidebar } from "@/components/workflow/production/ProductionSidebar";
import { ProductionDetailsTabs } from "@/components/workflow/production/ProductionDetailsTabs";
import { useToast } from "@/components/ui/use-toast";
import { useProductionTeamAssignment } from "@/hooks/production/useProductionTeamAssignment";
import { supabase } from "@/integrations/supabase/client";
import { scheduledEventToDb } from "@/utils/supabaseConverters";

export default function ProductionPage() {
  const { toast } = useToast();
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ScheduledEvent | null>(null);
  const [activeTab, setActiveTab] = useState("tracking");
  
  // Use our team assignment hook
  const { 
    handleAssignTeamMember, 
    handleUpdateAssignmentStatus 
  } = useProductionTeamAssignment(events, setEvents, selectedEvent, setSelectedEvent);
  
  // Load events and team members from localStorage on mount
  useEffect(() => {
    // Load events
    const loadEvents = async () => {
      try {
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
          // Transform data if needed
          const transformedEvents = productionEvents.map(event => ({
            ...event,
            assignments: event.assignments || [],
            timeTracking: event.timetracking || [],
            deliverables: event.deliverables || []
          })) as ScheduledEvent[];
          
          setEvents(transformedEvents);
          return;
        }
        
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
      }
    };
    
    // Load team members
    const loadTeamMembers = async () => {
      try {
        // Try to load from Supabase first
        const { data: teamMembersData, error } = await supabase
          .from('team_members')
          .select('*');
          
        if (error) {
          console.error("Error loading team members from Supabase:", error);
          throw error;
        }
        
        if (teamMembersData && teamMembersData.length > 0) {
          console.log("Loaded team members from Supabase:", teamMembersData);
          
          // Transform data if needed
          const transformedMembers = teamMembersData.map(member => ({
            ...member,
            availability: typeof member.availability === 'string' 
              ? JSON.parse(member.availability) 
              : member.availability || {}
          })) as TeamMember[];
          
          setTeamMembers(transformedMembers);
          return;
        }
        
        // Fallback to localStorage
        const savedTeamMembers = localStorage.getItem("teamMembers");
        if (savedTeamMembers) {
          setTeamMembers(JSON.parse(savedTeamMembers));
        }
      } catch (error) {
        console.error("Error loading team members:", error);
        
        // Fallback to localStorage
        const savedTeamMembers = localStorage.getItem("teamMembers");
        if (savedTeamMembers) {
          setTeamMembers(JSON.parse(savedTeamMembers));
        }
      }
    };
    
    loadEvents();
    loadTeamMembers();
  }, []);
  
  // Save events to Supabase whenever they change
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
      
      // Also update localStorage as fallback
      const savedEvents = localStorage.getItem("scheduledEvents");
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents);
        const filteredEvents = parsedEvents.filter(
          (event: ScheduledEvent) => event.id !== events.find(e => e.id === event.id)?.id
        );
        const allEvents = [...filteredEvents, ...events];
        localStorage.setItem("scheduledEvents", JSON.stringify(allEvents));
      }
    }
  }, [events]);
  
  // Update an event
  const handleUpdateEvent = (updatedEvent: ScheduledEvent) => {
    setEvents(prev => prev.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
    
    // Update selected event as well
    if (selectedEvent && selectedEvent.id === updatedEvent.id) {
      setSelectedEvent(updatedEvent);
    }
  };
  
  // Log additional time for a team member
  const handleLogTime = (eventId: string, teamMemberId: string, hours: number) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        const existingTimeTracking = event.timeTracking || [];
        const today = new Date().toISOString().split('T')[0];
        
        // Check if there's already a time entry for this team member today
        const existingEntryIndex = existingTimeTracking.findIndex(
          entry => entry.teamMemberId === teamMemberId && entry.date === today
        );
        
        if (existingEntryIndex >= 0) {
          // Update existing entry
          const updatedTimeTracking = [...existingTimeTracking];
          updatedTimeTracking[existingEntryIndex] = {
            ...updatedTimeTracking[existingEntryIndex],
            hoursLogged: updatedTimeTracking[existingEntryIndex].hoursLogged + hours
          };
          
          return {
            ...event,
            timeTracking: updatedTimeTracking
          };
        } else {
          // Add new entry
          return {
            ...event,
            timeTracking: [
              ...existingTimeTracking,
              {
                teamMemberId,
                hoursLogged: hours,
                date: today
              }
            ]
          };
        }
      }
      return event;
    }));
    
    // Update selected event if necessary
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent(events.find(e => e.id === eventId) || null);
    }
    
    toast({
      title: "Time Logged",
      description: `Successfully logged ${hours} hours.`,
    });
  };
  
  // Update event notes
  const handleUpdateNotes = (eventId: string, notes: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, notes } : event
    ));
    
    // Update selected event if necessary
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent(prev => prev ? { ...prev, notes } : null);
    }
    
    toast({
      title: "Notes Saved",
      description: "Production notes have been updated.",
    });
  };
  
  // Move event to post-production
  const handleMoveToPostProduction = (eventId: string) => {
    const eventToMove = events.find(e => e.id === eventId);
    if (!eventToMove) return;
    
    // Update the event stage
    const updatedEvents = events.map(event => 
      event.id === eventId ? { ...event, stage: "post-production" as const } : event
    );
    
    setEvents(prev => prev.filter(event => event.id !== eventId));
    
    // Update all events in Supabase
    const saveEvents = async () => {
      try {
        for (const event of updatedEvents) {
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
    
    // Update all events in localStorage
    const savedEvents = localStorage.getItem("scheduledEvents");
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents);
      const filteredEvents = parsedEvents.filter(
        (event: ScheduledEvent) => event.id !== eventId
      );
      const allEvents = [...filteredEvents, {...eventToMove, stage: "post-production"}];
      localStorage.setItem("scheduledEvents", JSON.stringify(allEvents));
    }
    
    // Update selected event or clear selection if it was moved
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent(null);
    }
    
    toast({
      title: "Event Moved",
      description: `${eventToMove.name} has been moved to post-production.`,
    });
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Production</h1>
            <p className="text-sm text-muted-foreground">
              Track ongoing shoots and production activities
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1">
            <ProductionSidebar 
              events={events} 
              selectedEvent={selectedEvent}
              onSelectEvent={setSelectedEvent}
              onMoveToPostProduction={handleMoveToPostProduction}
            />
          </div>
          
          <div className="lg:col-span-3">
            <ProductionDetailsTabs
              selectedEvent={selectedEvent}
              teamMembers={teamMembers}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onLogTime={handleLogTime}
              onUpdateNotes={handleUpdateNotes}
              onUpdateEvent={handleUpdateEvent}
              onAssignTeamMember={handleAssignTeamMember}
              onUpdateAssignmentStatus={handleUpdateAssignmentStatus}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
