
import Layout from "@/components/Layout";
import { usePreProductionEvents } from "@/hooks/usePreProductionEvents";
import { useClientRequirements } from "@/hooks/useClientRequirements";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventAssignments } from "@/components/scheduling/assignments/EventAssignments";
import { PreProductionContent } from "./PreProductionContent";
import { useTeamAssignmentsTab } from "@/hooks/useTeamAssignmentsTab";
import { useSchedulingTab } from "@/hooks/useSchedulingTab";
import { useTabState } from "@/hooks/useTabState";
import { TeamManagement } from "@/components/team/TeamManagement";
import { LoadingSkeleton } from "@/components/workflow/pre-production/LoadingSkeleton";
import { useTeamMembersData } from "@/hooks/useTeamMembersData";

export default function PreProductionPage() {
  // Tab state management
  const { activeTab, setActiveTab } = useTabState("details");
  
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
    deleteCompletedEvent
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
  
  // Scheduling tab hook
  const {
    getAssignmentCounts,
    handleAssignTeamMemberForScheduling,
    handleUpdateSchedulingStatus
  } = useSchedulingTab(events, setEvents, teamMembers);
  
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
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Event Details</TabsTrigger>
            <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
            <TabsTrigger value="team">Team Management</TabsTrigger>
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
            <EventAssignments 
              events={events}
              teamMembers={teamMembers} 
              onAssign={handleAssignTeamMemberForScheduling}
              onUpdateStatus={handleUpdateSchedulingStatus}
              getAssignmentCounts={getAssignmentCounts}
            />
          </TabsContent>

          <TabsContent value="team">
            <TeamManagement 
              teamMembers={teamMembers} 
              onAddTeamMember={handleAddTeamMember}
              onUpdateTeamMember={handleUpdateTeamMember}
              onDeleteTeamMember={handleDeleteTeamMember}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
