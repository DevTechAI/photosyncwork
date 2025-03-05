
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { PreProductionEventList } from "@/components/workflow/pre-production/EventList/PreProductionEventList";
import { CompletedEventsList } from "@/components/workflow/pre-production/EventList/CompletedEventsList";
import { EventDetailsTabs } from "@/components/workflow/pre-production/EventDetailsTabs";

interface PreProductionContentProps {
  events: ScheduledEvent[];
  completedEvents: ScheduledEvent[];
  selectedEvent: ScheduledEvent | null;
  setSelectedEvent: (event: ScheduledEvent) => void;
  deleteCompletedEvent: (eventId: string) => void;
  clientRequirements: string;
  setClientRequirements: (value: string) => void;
  teamMembers: TeamMember[];
  assignedTeamMembers: Array<{ teamMember?: TeamMember } & any>;
  availablePhotographers: TeamMember[];
  availableVideographers: TeamMember[];
  loading: boolean;
  handleSaveRequirements: () => void;
  handleAssignTeamMember: (teamMemberId: string, role: "photographer" | "videographer") => void;
  handleMoveToProduction: () => void;
  handleUpdateAssignmentStatus: (eventId: string, teamMemberId: string, status: "accepted" | "declined") => void;
}

export function PreProductionContent({
  events,
  completedEvents,
  selectedEvent,
  setSelectedEvent,
  deleteCompletedEvent,
  clientRequirements,
  setClientRequirements,
  teamMembers,
  assignedTeamMembers,
  availablePhotographers,
  availableVideographers,
  loading,
  handleSaveRequirements,
  handleAssignTeamMember,
  handleMoveToProduction,
  handleUpdateAssignmentStatus
}: PreProductionContentProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Event Lists Section */}
      <div>
        <PreProductionEventList 
          events={events}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
        />
        
        {/* Completed Events Section */}
        <CompletedEventsList
          events={completedEvents}
          teamMembers={teamMembers}
          onDelete={deleteCompletedEvent}
        />
      </div>
      
      {/* Event Details and Team Assignment */}
      <div className="lg:col-span-2">
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
  );
}
