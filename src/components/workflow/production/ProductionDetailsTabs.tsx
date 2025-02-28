
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeTrackingTab } from "./TimeTrackingTab";
import { ProductionNotesTab } from "./ProductionNotesTab";

interface ProductionDetailsTabsProps {
  events: ScheduledEvent[];
  teamMembers: TeamMember[];
  activeTab: string;
  setActiveTab: (value: string) => void;
  onLogTime: (eventId: string, teamMemberId: string, hours: number) => void;
}

export function ProductionDetailsTabs({
  events,
  teamMembers,
  activeTab,
  setActiveTab,
  onLogTime
}: ProductionDetailsTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full justify-start mb-4">
        <TabsTrigger value="tracking">Time Tracking</TabsTrigger>
        <TabsTrigger value="notes">Production Notes</TabsTrigger>
      </TabsList>
      
      {/* Time Tracking Tab */}
      <TabsContent value="tracking">
        <TimeTrackingTab 
          events={events} 
          teamMembers={teamMembers} 
          onLogTime={onLogTime} 
        />
      </TabsContent>
      
      {/* Production Notes Tab */}
      <TabsContent value="notes">
        <ProductionNotesTab events={events} />
      </TabsContent>
    </Tabs>
  );
}
