
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { TimeTrackingTab } from "./TimeTrackingTab";
import { ProductionNotesTab } from "./ProductionNotesTab";
import { Button } from "@/components/ui/button";
import { ClientRequirementsDialog } from "./ClientRequirementsDialog";
import { ProductionDeliverablesTab } from "./ProductionDeliverablesTab";

interface ProductionDetailsTabsProps {
  selectedEvent: ScheduledEvent | null;
  teamMembers: TeamMember[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogTime: (eventId: string, teamMemberId: string, hours: number) => void;
  onUpdateNotes: (eventId: string, notes: string) => void;
}

export function ProductionDetailsTabs({
  selectedEvent,
  teamMembers,
  activeTab,
  setActiveTab,
  onLogTime,
  onUpdateNotes
}: ProductionDetailsTabsProps) {
  const [showRequirementsDialog, setShowRequirementsDialog] = useState(false);
  
  // Find team members assigned to this event and resolve their names
  const getTeamMemberName = (teamMemberId: string): string => {
    const teamMember = teamMembers.find(tm => tm.id === teamMemberId);
    return teamMember ? teamMember.name : "Unknown";
  };
  
  if (!selectedEvent) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Select an event to view details</p>
      </Card>
    );
  }
  
  // Get time entries for this event
  const timeEntries = selectedEvent.timeTracking || [];
  
  // Handle adding time entry
  const handleAddTimeEntry = (teamMemberId: string, hours: number) => {
    if (selectedEvent) {
      onLogTime(selectedEvent.id, teamMemberId, hours);
    }
  };
  
  // Handle saving notes
  const handleSaveNotes = (notes: string) => {
    if (selectedEvent) {
      onUpdateNotes(selectedEvent.id, notes);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">{selectedEvent.name}</h2>
          <p className="text-muted-foreground">
            {new Date(selectedEvent.date).toLocaleDateString()} • {selectedEvent.clientName}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowRequirementsDialog(true)}
          >
            View Client Requirements
          </Button>
        </div>
      </div>
      
      {/* Team members assigned to this event */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Assigned Team Members</h3>
        <div className="flex flex-wrap gap-2">
          {selectedEvent.assignments && selectedEvent.assignments.length > 0 ? (
            selectedEvent.assignments.map((assignment, index) => (
              <div 
                key={index}
                className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
              >
                {getTeamMemberName(assignment.teamMemberId)}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No team members assigned</p>
          )}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="tracking">Time Tracking</TabsTrigger>
          <TabsTrigger value="notes">Production Notes</TabsTrigger>
          <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tracking">
          <TimeTrackingTab
            event={selectedEvent}
            teamMembers={teamMembers}
            onLogTime={(teamMemberId, hours) => handleAddTimeEntry(teamMemberId, hours)}
          />
        </TabsContent>
        
        <TabsContent value="notes">
          <ProductionNotesTab
            initialNotes={selectedEvent.notes || ""}
            onSave={handleSaveNotes}
          />
        </TabsContent>
        
        <TabsContent value="deliverables">
          <ProductionDeliverablesTab 
            deliverables={selectedEvent.deliverables || []}
            eventId={selectedEvent.id}
          />
        </TabsContent>
      </Tabs>
      
      {showRequirementsDialog && (
        <ClientRequirementsDialog
          open={showRequirementsDialog}
          onClose={() => setShowRequirementsDialog(false)}
          requirements={selectedEvent.clientRequirements || "No requirements have been added."}
          references={selectedEvent.references || []}
        />
      )}
    </div>
  );
}
