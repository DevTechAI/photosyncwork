
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { TimeTrackingTab } from "./TimeTrackingTab";
import { ProductionNotesTab } from "./ProductionNotesTab";
import { ProductionDeliverablesTab } from "./ProductionDeliverablesTab";
import { TeamAssignmentTab } from "./TeamAssignmentTab";

interface ProductionDetailsTabsProps {
  selectedEvent: ScheduledEvent | null;
  teamMembers: TeamMember[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogTime: (eventId: string, teamMemberId: string, hours: number) => void;
  onUpdateNotes: (eventId: string, notes: string) => void;
  onUpdateEvent: (event: ScheduledEvent) => void;
  onAssignTeamMember?: (eventId: string, teamMemberId: string, role: string) => Promise<void>;
  onUpdateAssignmentStatus?: (eventId: string, teamMemberId: string, status: "accepted" | "declined" | "pending") => void;
}

export function ProductionDetailsTabs({
  selectedEvent,
  teamMembers,
  activeTab,
  setActiveTab,
  onLogTime,
  onUpdateNotes,
  onUpdateEvent,
  onAssignTeamMember,
  onUpdateAssignmentStatus
}: ProductionDetailsTabsProps) {
  if (!selectedEvent) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Select an event to view details</p>
      </Card>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="tracking">Time Tracking</TabsTrigger>
        <TabsTrigger value="notes">Production Notes</TabsTrigger>
        <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
        <TabsTrigger value="team">Team Management</TabsTrigger>
      </TabsList>
      
      <TabsContent value="tracking">
        <TimeTrackingTab
          selectedEvent={selectedEvent}
          teamMembers={teamMembers}
          onLogTime={onLogTime}
        />
      </TabsContent>
      
      <TabsContent value="notes">
        <ProductionNotesTab
          selectedEvent={selectedEvent}
          onUpdateNotes={onUpdateNotes}
        />
      </TabsContent>
      
      <TabsContent value="deliverables">
        <ProductionDeliverablesTab
          selectedEvent={selectedEvent}
          onUpdateEvent={onUpdateEvent}
        />
      </TabsContent>
      
      <TabsContent value="team">
        {onAssignTeamMember && onUpdateAssignmentStatus && (
          <TeamAssignmentTab
            selectedEvent={selectedEvent}
            teamMembers={teamMembers}
            onAssignTeamMember={onAssignTeamMember}
            onUpdateAssignmentStatus={onUpdateAssignmentStatus}
            onLogTime={onLogTime}
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
