
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { DeliverablesContainer } from "./deliverables/DeliverablesContainer";
import { AssignDeliverableModal } from "./deliverables/AssignDeliverableModal";
import { RevisionRequestModal } from "./deliverables/RevisionRequestModal";
import { ClientAccessSection } from "./sections/ClientAccessSection";
import { FileUploadSection } from "./sections/FileUploadSection";
import { useDeliverableManagement } from "./hooks/useDeliverableManagement";

interface PostProductionDeliverablesProps {
  selectedEvent: ScheduledEvent;
  setSelectedEvent: (event: ScheduledEvent) => void;
  updateEvents: (updatedEvent: ScheduledEvent) => void;
  teamMembers: TeamMember[];
}

export function PostProductionDeliverables({ 
  selectedEvent, 
  setSelectedEvent, 
  updateEvents,
  teamMembers 
}: PostProductionDeliverablesProps) {
  const {
    isAssignDeliverableModalOpen,
    setIsAssignDeliverableModalOpen,
    isRevisionModalOpen,
    setIsRevisionModalOpen,
    selectedDeliverableId,
    handleOpenAssignModal,
    handleAssignDeliverable,
    handleUpdateDeliverableStatus,
    handleOpenRevisionModal,
    handleRequestRevision,
    handleCompleteAllDeliverables
  } = useDeliverableManagement({
    selectedEvent,
    setSelectedEvent,
    updateEvents
  });

  // Check if all deliverables are assigned
  const areAllDeliverablesAssigned = selectedEvent?.deliverables?.every(d => d.assignedTo);
  
  // Check if the event is ready for completion
  const isReadyForCompletion = selectedEvent?.deliverables?.every(d => d.status === "completed");
  
  return (
    <div className="space-y-6">
      {/* Client Access Section */}
      <ClientAccessSection selectedEvent={selectedEvent} />

      {/* Upload Section */}
      <FileUploadSection 
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        updateEvents={updateEvents}
      />

      {/* Deliverables Container */}
      <DeliverablesContainer 
        selectedEvent={selectedEvent}
        teamMembers={teamMembers}
        onUpdateDeliverableStatus={handleUpdateDeliverableStatus}
        onOpenAssignModal={handleOpenAssignModal}
        onOpenRevisionModal={handleOpenRevisionModal}
        onCompleteAllDeliverables={handleCompleteAllDeliverables}
        areAllDeliverablesAssigned={areAllDeliverablesAssigned}
        isReadyForCompletion={isReadyForCompletion}
      />

      {/* Modals */}
      <AssignDeliverableModal 
        isOpen={isAssignDeliverableModalOpen}
        onClose={() => setIsAssignDeliverableModalOpen(false)}
        selectedEvent={selectedEvent}
        selectedDeliverableId={selectedDeliverableId}
        teamMembers={teamMembers}
        onAssign={handleAssignDeliverable}
      />
      
      <RevisionRequestModal 
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        onRequestRevision={handleRequestRevision}
      />
    </div>
  );
}
