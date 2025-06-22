
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { TimeTrackingTab } from "./TimeTrackingTab";
import { ProductionNotesTab } from "./ProductionNotesTab";
import { TeamAssignmentTab } from "./TeamAssignmentTab";
import { QualityCheckTab } from "./QualityCheckTab";
import { ProductionDeliverablesTab } from "./ProductionDeliverablesTab";

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
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap">
        <div>
          <h2 className="text-xl font-medium">{selectedEvent.name}</h2>
          <p className="text-sm text-muted-foreground">
            Client: {selectedEvent.clientName} | {new Date(selectedEvent.date).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 flex flex-wrap w-full">
          <TabsTrigger value="tracking" className="flex-grow">Time</TabsTrigger>
          <TabsTrigger value="notes" className="flex-grow">Notes</TabsTrigger>
          <TabsTrigger value="team" className="flex-grow">Team</TabsTrigger>
          <TabsTrigger value="deliverables" className="flex-grow">Deliverables</TabsTrigger>
          <TabsTrigger value="quality" className="flex-grow">Quality</TabsTrigger>
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
        
        <TabsContent value="deliverables">
          <ProductionDeliverablesTab
            selectedEvent={selectedEvent}
            onUpdateEvent={onUpdateEvent}
          />
        </TabsContent>
        
        <TabsContent value="quality">
          <QualityCheckTab
            selectedEvent={selectedEvent}
            onUpdateEvent={onUpdateEvent}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
