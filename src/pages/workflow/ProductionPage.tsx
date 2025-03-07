
import Layout from "@/components/Layout";
import { ProductionSidebar } from "@/components/workflow/production/ProductionSidebar";
import { ProductionDetailsTabs } from "@/components/workflow/production/ProductionDetailsTabs";
import { useProductionPage } from "@/hooks/production/useProductionPage";

export default function ProductionPage() {
  const {
    events,
    teamMembers,
    selectedEvent,
    setSelectedEvent,
    activeTab,
    setActiveTab,
    handleUpdateEvent,
    handleLogTime,
    handleUpdateNotes,
    handleMoveToPostProduction,
    handleAssignTeamMember,
    handleUpdateAssignmentStatus
  } = useProductionPage();

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
