
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { Badge } from "@/components/ui/badge";
import { DeliverableCard } from "./DeliverableCard";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, FilePlus } from "lucide-react";
import { useState } from "react";
import { MediaTagger } from "@/components/ai/MediaTagger";

interface DeliverablesContainerProps {
  selectedEvent: ScheduledEvent;
  teamMembers: TeamMember[];
  onUpdateDeliverableStatus: (deliverableId: string, status: "pending" | "in-progress" | "delivered" | "revision-requested" | "completed") => void;
  onOpenAssignModal: (deliverableId: string) => void;
  onOpenRevisionModal: (deliverableId: string) => void;
  onCompleteAllDeliverables: () => void;
  areAllDeliverablesAssigned: boolean;
  isReadyForCompletion: boolean;
}

export function DeliverablesContainer({
  selectedEvent,
  teamMembers,
  onUpdateDeliverableStatus,
  onOpenAssignModal,
  onOpenRevisionModal,
  onCompleteAllDeliverables,
  areAllDeliverablesAssigned,
  isReadyForCompletion
}: DeliverablesContainerProps) {
  const [isAIToolsOpen, setIsAIToolsOpen] = useState(false);

  const handleTagsGenerated = (tags: Record<string, string[]>) => {
    // You can implement functionality to save tags to event metadata if needed
    console.log("Tags generated:", tags);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div>Deliverables</div>
          <div className="flex gap-2">
            <Button 
              onClick={onCompleteAllDeliverables} 
              disabled={!isReadyForCompletion} 
              className="ml-auto"
            >
              {isReadyForCompletion ? "Complete All & Finalize Event" : "All Items Must Be Completed"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AI Tools Collapsible */}
        <Collapsible 
          open={isAIToolsOpen} 
          onOpenChange={setIsAIToolsOpen}
          className="border rounded-md"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4">
            <div className="font-medium flex items-center">
              <FilePlus className="mr-2 h-4 w-4" />
              AI Media Tools
            </div>
            {isAIToolsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 border-t">
            <MediaTagger
              eventId={selectedEvent.id}
              eventName={selectedEvent.name}
              clientName={selectedEvent.clientName}
              onTagsGenerated={handleTagsGenerated}
            />
          </CollapsibleContent>
        </Collapsible>
        
        {/* Deliverables List */}
        {selectedEvent.deliverables?.length > 0 ? (
          <div className="space-y-4">
            {selectedEvent.deliverables.map((deliverable, index) => (
              <DeliverableCard
                key={index}
                deliverable={deliverable}
                teamMembers={teamMembers}
                onUpdateStatus={onUpdateDeliverableStatus}
                onOpenAssignModal={onOpenAssignModal}
                onOpenRevisionModal={onOpenRevisionModal}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-6 border border-dashed rounded-md">
            <p className="text-muted-foreground">No deliverables tracked for this project</p>
            <p className="text-sm text-muted-foreground mt-1">
              Deliverables are typically imported from the approved estimate
            </p>
          </div>
        )}
        
        {selectedEvent.deliverables?.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <div>
                <Badge variant={areAllDeliverablesAssigned ? "default" : "outline"} className="mr-2">
                  {areAllDeliverablesAssigned ? "All Assigned" : "Assignment Needed"}
                </Badge>
                <Badge variant={isReadyForCompletion ? "default" : "outline"}>
                  {isReadyForCompletion ? "Ready for Completion" : "In Progress"}
                </Badge>
              </div>
              <Button 
                onClick={onCompleteAllDeliverables} 
                disabled={!isReadyForCompletion}
                variant={isReadyForCompletion ? "default" : "outline"}
              >
                Finalize Event
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
