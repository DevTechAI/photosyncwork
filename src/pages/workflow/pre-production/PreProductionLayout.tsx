
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { usePreProductionEvents } from "@/hooks/usePreProductionEvents";
import { useClientRequirements } from "@/hooks/useClientRequirements";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PreProductionContent } from "./PreProductionContent";
import { useTeamAssignmentsTab } from "@/hooks/useTeamAssignmentsTab";
import { useTabState } from "@/hooks/useTabState";
import { TeamManagement } from "@/components/team/TeamManagement";
import { LoadingSkeleton } from "@/components/workflow/pre-production/LoadingSkeleton";
import { useTeamMembersData } from "@/hooks/useTeamMembersData";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { createEventsFromApprovedEstimates } from "@/components/scheduling/utils/estimateConversion";
import { useToast } from "@/components/ui/use-toast";
import { SchedulingPage } from "@/pages/scheduling/SchedulingPage";

export default function PreProductionPage() {
  // Tab state management
  const { activeTab, setActiveTab } = useTabState("details");
  const { toast } = useToast();
  
  // Team members management
  const { 
    teamMembers, 
    handleAddTeamMember, 
    handleUpdateTeamMember, 
    handleDeleteTeamMember 
  } = useTeamMembersData();
  
  // Events management hook
  const { 
    isLoading,
    events, 
    setEvents, 
    completedEvents, 
    selectedEvent, 
    setSelectedEvent,
    deleteCompletedEvent,
    loadEvents
  } = usePreProductionEvents();
  
  // Client requirements hook
  const { 
    clientRequirements, 
    setClientRequirements, 
    handleSaveRequirements 
  } = useClientRequirements(selectedEvent, setEvents, setSelectedEvent);
  
  // Team assignment tab hook
  const {
    loading,
    availablePhotographers,
    availableVideographers,
    assignedTeamMembers,
    handleAssignTeamMember,
    handleMoveToProduction,
    handleUpdateAssignmentStatus
  } = useTeamAssignmentsTab(events, setEvents, selectedEvent, setSelectedEvent, teamMembers);
  
  // Debug logging
  useEffect(() => {
    if (events?.length > 0) {
      console.log("Events in PreProductionLayout:", events);
    }
    if (teamMembers?.length > 0) {
      console.log("Team members in PreProductionLayout:", teamMembers);
    }
  }, [events, teamMembers]);
  
  // Function to manually check for and create events from approved estimates
  const handleCheckForApprovedEstimates = async () => {
    try {
      toast({ title: "Checking for approved estimates..." });
      
      const newEvents = await createEventsFromApprovedEstimates();
      
      if (newEvents.length > 0) {
        toast({
          title: "Events Created",
          description: `Created ${newEvents.length} new events from approved estimates.`
        });
        // Reload events to show the newly created ones
        await loadEvents();
      } else {
        toast({
          title: "No New Events",
          description: "No new events were created. Either there are no approved estimates or events already exist for them."
        });
      }
    } catch (error) {
      console.error("Error checking for approved estimates:", error);
      toast({
        title: "Error",
        description: "Failed to create events from approved estimates.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Pre-Production</h1>
            <p className="text-sm text-muted-foreground">
              Prepare for upcoming events and assign team members
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadEvents}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Events
            </Button>
            <Button 
              size="sm" 
              onClick={handleCheckForApprovedEstimates}
            >
              Check Approved Estimates
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Event Details</TabsTrigger>
            <TabsTrigger value="scheduling">Team Assignment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <PreProductionContent 
                events={events}
                completedEvents={completedEvents}
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
                deleteCompletedEvent={deleteCompletedEvent}
                clientRequirements={clientRequirements}
                setClientRequirements={setClientRequirements}
                teamMembers={teamMembers}
                assignedTeamMembers={assignedTeamMembers}
                availablePhotographers={availablePhotographers}
                availableVideographers={availableVideographers}
                loading={loading}
                handleSaveRequirements={handleSaveRequirements}
                handleAssignTeamMember={handleAssignTeamMember}
                handleMoveToProduction={handleMoveToProduction}
                handleUpdateAssignmentStatus={handleUpdateAssignmentStatus}
              />
            )}
          </TabsContent>
          
          <TabsContent value="scheduling">
            <SchedulingPage embedded={true} customTabs={["pre-production"]} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
