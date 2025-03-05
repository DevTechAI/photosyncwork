
import { useState, useEffect } from "react";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { CreateEventModal } from "@/components/scheduling/CreateEventModal";
import { SchedulingHeader } from "./components/SchedulingHeader";
import { SchedulingTabs } from "./components/SchedulingTabs";
import { useSchedulingPage } from "@/hooks/scheduling/useSchedulingPage";
import { useTeamMembersData } from "@/hooks/useTeamMembersData";
import { createEventsFromApprovedEstimates, getAllEvents } from "@/components/scheduling/utils/eventHelpers";
import { dbToScheduledEvent, scheduledEventToDb } from "@/utils/supabaseConverters";
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
        const newEvents = await createEventsFromApprovedEstimates();
        
        // Load events from Supabase
        const supabaseEvents = await getAllEvents();
        
        // If we have data from Supabase, use it
        if (supabaseEvents && supabaseEvents.length > 0) {
          setEvents(supabaseEvents);
        } else if (newEvents.length > 0) {
          // If no Supabase data but we have new events from estimates
          setEvents(newEvents);
        }
      } catch (error) {
        console.error("Error in loadEvents:", error);
      }
    };
    
    loadEvents();
  }, [setEvents]);
  
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
          open={showCreateEventModal}
          onClose={() => setShowCreateEventModal(false)}
          onCreateEvent={handleCreateEvent}
        />
      )}
    </div>
  );
}
