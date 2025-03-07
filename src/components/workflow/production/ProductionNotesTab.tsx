
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { ScheduledEvent } from "@/components/scheduling/types";

interface ProductionNotesTabProps {
  selectedEvent: ScheduledEvent;
  onUpdateNotes: (eventId: string, notes: string) => void;
}

export function ProductionNotesTab({ selectedEvent, onUpdateNotes }: ProductionNotesTabProps) {
  const [notes, setNotes] = useState(selectedEvent.notes || "");
  
  const handleSave = () => {
    onUpdateNotes(selectedEvent.id, notes);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Production Notes</h3>
      
      <Card className="p-4">
        <div className="space-y-4">
          <Textarea
            placeholder="Enter production notes, instructions, and observations here..."
            className="min-h-[200px]"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          
          <div className="flex justify-end">
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Notes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
