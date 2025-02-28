
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Save } from "lucide-react";
import { ScheduledEvent } from "@/components/scheduling/types";
import { useToast } from "@/components/ui/use-toast";
import { ClientRequirementsDialog } from "./ClientRequirementsDialog";

interface ProductionNotesTabProps {
  event: ScheduledEvent;
  onUpdateNotes: (notes: string) => void;
}

export function ProductionNotesTab({ 
  event, 
  onUpdateNotes 
}: ProductionNotesTabProps) {
  const { toast } = useToast();
  const [notes, setNotes] = useState(event.notes || "");
  const [showClientRequirements, setShowClientRequirements] = useState(false);
  
  // Update notes when event changes
  useEffect(() => {
    setNotes(event.notes || "");
  }, [event]);
  
  const handleSaveNotes = () => {
    onUpdateNotes(notes);
    
    toast({
      title: "Notes Saved",
      description: "Production notes have been saved successfully",
    });
  };
  
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Production Notes for {event.name}</h3>
          <Button 
            variant="outline" 
            onClick={() => setShowClientRequirements(true)}
          >
            View Client Requirements
          </Button>
        </div>
        
        <Textarea
          placeholder="Add production notes, observations, and important details from the shoot..."
          className="min-h-[200px]"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        
        <Button 
          className="mt-4"
          onClick={handleSaveNotes}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Notes
        </Button>
      </Card>
      
      <ClientRequirementsDialog
        isOpen={showClientRequirements}
        onOpenChange={setShowClientRequirements}
        clientRequirements={event.clientRequirements || "No specific requirements provided."}
      />
    </div>
  );
}
