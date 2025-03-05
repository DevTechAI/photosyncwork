
import { useState, useEffect } from "react";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { CreateEventModal } from "@/components/scheduling/CreateEventModal";
import { SchedulingHeader } from "./components/SchedulingHeader";
import { SchedulingTabs } from "./components/SchedulingTabs";
import { useSchedulingPage } from "@/hooks/useSchedulingPage";
import { useTeamMembersData } from "@/hooks/useTeamMembersData";
import { createEventsFromApprovedEstimates } from "@/components/scheduling/utils/eventHelpers";
import { supabase } from "@/integrations/supabase/client";

export default function SchedulingPage() {
  // Get team members data and handlers
  const { 
    teamMembers, 
    handleAddTeamMember, 
    handleUpdateTeamMember, 
    handleDeleteTeamMember 
  } = useTeamMembersData();
  
  // Initialize with empty arrays, will load from Supabase
  const { 
    events, 
    setEvents,
    showCreateEventModal,
    setShowCreateEventModal,
    mainTab,
    setMainTab,
    handleCreateEvent,
    handleAssignTeamMember,
    handleUpdateAssignmentStatus,
    getAssignmentCounts,
    getEventsByStage
  } = useSchedulingPage([], teamMembers);
  
  // Load events from Supabase on component mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        // First, check for any approved estimates that need to be converted to events
        const newEvents = createEventsFromApprovedEstimates();
        
        // Load events from Supabase
        const { data: supabaseEvents, error } = await supabase
          .from('scheduled_events')
          .select('*');
        
        if (error) {
          console.error("Error fetching events:", error);
          return;
        }
        
        // If we have data from Supabase, use it
        if (supabaseEvents && supabaseEvents.length > 0) {
          // Convert assignments from JSON strings if needed
          const processedEvents = supabaseEvents.map(event => ({
            ...event,
            assignments: Array.isArray(event.assignments) 
              ? event.assignments 
              : typeof event.assignments === 'string' 
                ? JSON.parse(event.assignments) 
                : [],
            deliverables: Array.isArray(event.deliverables) 
              ? event.deliverables 
              : typeof event.deliverables === 'string' 
                ? JSON.parse(event.deliverables) 
                : []
          })) as ScheduledEvent[];
          
          setEvents(processedEvents);
        } else if (newEvents.length > 0) {
          // If no Supabase data but we have new events from estimates
          setEvents(newEvents);
          
          // Save new events to Supabase
          for (const event of newEvents) {
            await supabase
              .from('scheduled_events')
              .insert(event);
          }
        }
      } catch (error) {
        console.error("Error in loadEvents:", error);
      }
    };
    
    loadEvents();
  }, [setEvents]);
  
  // Save events to Supabase whenever they change
  useEffect(() => {
    if (events.length > 0) {
      const saveEvents = async () => {
        try {
          // Update or insert each event
          for (const event of events) {
            // Check if event already exists
            const { data: existingEvent } = await supabase
              .from('scheduled_events')
              .select('id')
              .eq('id', event.id)
              .single();
            
            if (existingEvent) {
              // Update existing event
              await supabase
                .from('scheduled_events')
                .update(event)
                .eq('id', event.id);
            } else {
              // Insert new event
              await supabase
                .from('scheduled_events')
                .insert(event);
            }
          }
        } catch (error) {
          console.error("Error saving events to Supabase:", error);
        }
      };
      
      saveEvents();
    }
  }, [events]);
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <SchedulingHeader onCreateEvent={() => setShowCreateEventModal(true)} />
      
      <SchedulingTabs
        activeTab={mainTab}
        onTabChange={setMainTab}
        events={events}
        teamMembers={teamMembers}
        getEventsByStage={getEventsByStage}
        onAssignTeamMember={handleAssignTeamMember}
        onUpdateAssignmentStatus={handleUpdateAssignmentStatus}
        getAssignmentCounts={getAssignmentCounts}
        onUpdateTeamMember={handleUpdateTeamMember}
        onAddTeamMember={handleAddTeamMember}
        onDeleteTeamMember={handleDeleteTeamMember}
      />
      
      {showCreateEventModal && (
        <CreateEventModal
          isOpen={showCreateEventModal}
          onClose={() => setShowCreateEventModal(false)}
          onCreateEvent={handleCreateEvent}
        />
      )}
    </div>
  );
}
