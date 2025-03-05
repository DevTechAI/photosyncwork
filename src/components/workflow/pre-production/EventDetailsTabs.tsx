
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { Camera } from "lucide-react";
import { EventDetailsTab } from "./EventDetailsTab";
import { ClientRequirementsTab } from "./ClientRequirementsTab";
import { TeamAssignmentTab } from "../pre-production/TeamAssignmentTab";

interface EventDetailsTabsProps {
  selectedEvent: ScheduledEvent | null;
  setSelectedEvent: (event: ScheduledEvent | null) => void;
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
  handleUpdateAssignmentStatus?: (eventId: string, teamMemberId: string, status: "accepted" | "declined") => void;
}

export function EventDetailsTabs({
  selectedEvent,
  setSelectedEvent,
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
}: EventDetailsTabsProps) {
  return (
    <div className="lg:col-span-2">
      {selectedEvent ? (
        <Tabs defaultValue="details">
          <TabsList className="w-full">
            <TabsTrigger value="details">Event Details</TabsTrigger>
            <TabsTrigger value="requirements">Client Requirements</TabsTrigger>
            <TabsTrigger value="team">Team Assignment</TabsTrigger>
          </TabsList>
          
          {/* Event Details Tab */}
          <TabsContent value="details">
            <EventDetailsTab selectedEvent={selectedEvent} />
          </TabsContent>
          
          {/* Client Requirements Tab */}
          <TabsContent value="requirements">
            <ClientRequirementsTab 
              clientRequirements={clientRequirements}
              setClientRequirements={setClientRequirements}
              handleSaveRequirements={handleSaveRequirements}
            />
          </TabsContent>
          
          {/* Team Assignment Tab */}
          <TabsContent value="team">
            <TeamAssignmentTab 
              selectedEvent={selectedEvent}
              teamMembers={teamMembers}
              assignedTeamMembers={assignedTeamMembers}
              availablePhotographers={availablePhotographers}
              availableVideographers={availableVideographers}
              loading={loading}
              handleAssignTeamMember={handleAssignTeamMember}
              handleMoveToProduction={handleMoveToProduction}
              handleUpdateAssignmentStatus={handleUpdateAssignmentStatus}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="border rounded-lg p-12 text-center">
          <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Select an Event</h3>
          <p className="text-muted-foreground mt-1">
            Select an event from the list to view details and assign team members
          </p>
        </div>
      )}
    </div>
  );
}
