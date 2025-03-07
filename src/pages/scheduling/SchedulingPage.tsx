
import { useState, useEffect } from "react";
import { ScheduledEvent } from "@/components/scheduling/types";
import { CreateEventModal } from "@/components/scheduling/CreateEventModal";
import { SchedulingHeader } from "./components/SchedulingHeader";
import { SchedulingTabs } from "./components/SchedulingTabs";
import { useSchedulingPage } from "@/hooks/scheduling/useSchedulingPage";
import { useTeamMembersData } from "@/hooks/useTeamMembersData";
import { createEventsFromApprovedEstimates } from "@/components/scheduling/utils/estimateConversion";
import { getAllEvents } from "@/components/scheduling/utils/eventLoaders";
import { useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface SchedulingPageProps {
  embedded?: boolean;
  customTabs?: string[];
}

export function SchedulingPage({ embedded = false, customTabs }: SchedulingPageProps) {
  const location = useLocation();
  const { toast } = useToast();
  const queryParams = new URLSearchParams(location.search);
  const estimateIdFromUrl = queryParams.get('estimateId');
  
  // State for managing the estimate ID modal flow
  const [initialEstimateId, setInitialEstimateId] = useState<string | undefined>(
    estimateIdFromUrl || undefined
  );
  
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
  
  // Open create event modal with the estimate ID when navigated from estimates page
  useEffect(() => {
    if (estimateIdFromUrl) {
      setInitialEstimateId(estimateIdFromUrl);
      setShowCreateEventModal(true);
      
      // Clear the URL parameter after using it
      window.history.replaceState({}, document.title, "/scheduling");
      
      toast({
        title: "Create Event From Estimate",
        description: "You've been redirected to create an event from your approved estimate."
      });
    }
  }, [estimateIdFromUrl, setShowCreateEventModal, toast]);
  
  // Reset the initialEstimateId when modal is closed
  const handleCloseModal = () => {
    setShowCreateEventModal(false);
    setInitialEstimateId(undefined);
  };
  
  return (
    <div className={embedded ? "" : "container mx-auto py-6 space-y-8"}>
      {!embedded && (
        <SchedulingHeader onCreateEvent={() => setShowCreateEventModal(true)} />
      )}
      
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
        showCreateEventButton={!embedded}
        onCreateEvent={() => setShowCreateEventModal(true)}
        customTabs={customTabs}
      />
      
      {showCreateEventModal && (
        <CreateEventModal
          open={showCreateEventModal}
          onClose={handleCloseModal}
          onCreateEvent={handleCreateEvent}
          initialEstimateId={initialEstimateId}
        />
      )}
    </div>
  );
}

export default SchedulingPage;
