
import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { ProductionSidebar } from "@/components/workflow/production/ProductionSidebar";
import { ProductionDetailsTabs } from "@/components/workflow/production/ProductionDetailsTabs";
import { useToast } from "@/components/ui/use-toast";

export default function ProductionPage() {
  const { toast } = useToast();
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ScheduledEvent | null>(null);
  const [activeTab, setActiveTab] = useState("tracking");
  
  // Load events and team members from localStorage on mount
  useEffect(() => {
    // Load events
    const savedEvents = localStorage.getItem("scheduledEvents");
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents);
      setEvents(parsedEvents);
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
      localStorage.setItem("scheduledEvents", JSON.stringify(events));
    }
  }, [events]);
  
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
  };
  
  // Move event to post-production
  const handleMoveToPostProduction = (eventId: string) => {
    const eventToMove = events.find(e => e.id === eventId);
    if (!eventToMove) return;
    
    // Update the event stage
    const updatedEvents = events.map(event => 
      event.id === eventId ? { ...event, stage: "post-production" as const } : event
    );
    
    setEvents(updatedEvents);
    
    // Update selected event or clear selection if it was moved
    setSelectedEvent(null);
    
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
              events={events}
              teamMembers={teamMembers}
              selectedEvent={selectedEvent}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onLogTime={handleLogTime}
              onUpdateNotes={handleUpdateNotes}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
