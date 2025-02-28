
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeTrackingTab } from "./TimeTrackingTab";
import { ProductionNotesTab } from "./ProductionNotesTab";

interface ProductionDetailsTabsProps {
  events: ScheduledEvent[];
  teamMembers: TeamMember[];
  selectedEvent: ScheduledEvent | null;
  activeTab: string;
  setActiveTab: (value: string) => void;
  onLogTime: (eventId: string, teamMemberId: string, hours: number) => void;
  onUpdateNotes: (eventId: string, notes: string) => void;
}

export function ProductionDetailsTabs({
  events,
  teamMembers,
  selectedEvent,
  activeTab,
  setActiveTab,
  onLogTime,
  onUpdateNotes
}: ProductionDetailsTabsProps) {
  if (!selectedEvent) {
    return (
      <div className="border rounded-lg p-12 text-center">
        <h3 className="text-lg font-medium">Select an Event</h3>
        <p className="text-muted-foreground mt-1">
          Select an event from the sidebar to view details and track time
        </p>
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full justify-start mb-4">
        <TabsTrigger value="tracking">Time Tracking</TabsTrigger>
        <TabsTrigger value="notes">Production Notes</TabsTrigger>
      </TabsList>
      
      {/* Time Tracking Tab */}
      <TabsContent value="tracking">
        <TimeTrackingTab 
          event={selectedEvent} 
          teamMembers={teamMembers} 
          onLogTime={(teamMemberId, hours) => onLogTime(selectedEvent.id, teamMemberId, hours)} 
        />
      </TabsContent>
      
      {/* Production Notes Tab */}
      <TabsContent value="notes">
        <ProductionNotesTab 
          event={selectedEvent} 
          onUpdateNotes={(notes) => onUpdateNotes(selectedEvent.id, notes)} 
        />
      </TabsContent>
    </Tabs>
  );
}
