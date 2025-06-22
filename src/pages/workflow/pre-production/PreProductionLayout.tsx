
import Layout from "@/components/Layout";
import { PreProductionEventList } from "@/components/workflow/pre-production/PreProductionEventList";
import { EventDetailsTabs } from "@/components/workflow/pre-production/EventDetailsTabs";
import { useSchedulingPage } from "@/hooks/useSchedulingPage";

export default function PreProductionLayout() {
  const {
    events,
    teamMembers,
    selectedEvent,
    setSelectedEvent,
    clientRequirements,
    setClientRequirements,
    assignedTeamMembers,
    availablePhotographers,
    availableVideographers,
    loading,
    handleSaveRequirements,
    handleAssignTeamMember,
    handleMoveToProduction,
    handleUpdateAssignmentStatus
  } = useSchedulingPage();

  const preProductionEvents = events.filter(event => event.stage === "pre-production");

  return (
    <Layout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Pre-Production</h1>
          <p className="text-sm text-muted-foreground">
            Plan and prepare for upcoming events
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <PreProductionEventList 
              events={preProductionEvents}
              selectedEvent={selectedEvent}
              onSelectEvent={setSelectedEvent}
            />
          </div>
          
          <EventDetailsTabs
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
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
        </div>
      </div>
    </Layout>
  );
}
