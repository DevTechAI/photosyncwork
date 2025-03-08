
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostProductionDeliverables } from "./PostProductionDeliverables";
import { PostProductionTimeTrackingTab } from "./PostProductionTimeTrackingTab";

interface PostProductionContentProps {
  selectedEvent: ScheduledEvent | null;
  isLoading: boolean;
  teamMembers: TeamMember[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleUpdateEvents: (updatedEvent: ScheduledEvent) => void;
  handleLogTime: (teamMemberId: string, hours: number) => void;
}

export function PostProductionContent({
  selectedEvent,
  isLoading,
  teamMembers,
  activeTab,
  setActiveTab,
  handleUpdateEvents,
  handleLogTime
}: PostProductionContentProps) {
  if (!selectedEvent) {
    return (
      <div className="flex items-center justify-center h-32 bg-muted rounded-md">
        <p className="text-muted-foreground">
          {isLoading ? "Loading events..." : "Select an event to view details"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap">
        <div>
          <h2 className="text-xl font-medium">{selectedEvent.name}</h2>
          <p className="text-sm text-muted-foreground">
            Client: {selectedEvent.clientName} | {new Date(selectedEvent.date).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full flex mb-4">
          <TabsTrigger value="deliverables" className="flex-1">Deliverables</TabsTrigger>
          <TabsTrigger value="time-tracking" className="flex-1">Time Tracking</TabsTrigger>
        </TabsList>
        
        <TabsContent value="deliverables" className="pt-4">
          <PostProductionDeliverables
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent => handleUpdateEvents(setSelectedEvent)}
            updateEvents={handleUpdateEvents}
            teamMembers={teamMembers}
          />
        </TabsContent>
        
        <TabsContent value="time-tracking" className="pt-4">
          <PostProductionTimeTrackingTab
            event={selectedEvent}
            teamMembers={teamMembers}
            onLogTime={handleLogTime}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
