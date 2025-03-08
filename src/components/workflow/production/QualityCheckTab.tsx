
import { useState } from "react";
import { ScheduledEvent } from "@/components/scheduling/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface QualityCheckProps {
  selectedEvent: ScheduledEvent;
  onUpdateEvent: (event: ScheduledEvent) => void;
}

export function QualityCheckTab({ selectedEvent, onUpdateEvent }: QualityCheckProps) {
  // Get quality check data from event or initialize empty object
  const existingQualityCheck = selectedEvent.qualityCheck || {
    status: "pending",
    notes: "",
    checkedBy: "",
    lastChecked: ""
  };

  const [qualityStatus, setQualityStatus] = useState(existingQualityCheck.status);
  const [notes, setNotes] = useState(existingQualityCheck.notes);
  const [checkedBy, setCheckedBy] = useState(existingQualityCheck.checkedBy);

  const handleSaveQualityCheck = () => {
    const updatedEvent = {
      ...selectedEvent,
      qualityCheck: {
        status: qualityStatus,
        notes: notes,
        checkedBy: checkedBy,
        lastChecked: new Date().toISOString()
      }
    };
    
    onUpdateEvent(updatedEvent);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Quality Check Status</h3>
          <RadioGroup 
            value={qualityStatus} 
            onValueChange={setQualityStatus}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pending" id="pending" />
              <Label htmlFor="pending" className="font-normal">Pending Review</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="passed" id="passed" />
              <Label htmlFor="passed" className="font-normal">Passed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="failed" id="failed" />
              <Label htmlFor="failed" className="font-normal">Failed - Needs Correction</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Quality Checker</h3>
          <Input 
            placeholder="Enter your name"
            value={checkedBy}
            onChange={(e) => setCheckedBy(e.target.value)}
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Quality Notes</h3>
          <div className="mb-4">
            <textarea
              className="w-full min-h-[100px] p-2 border rounded-md"
              placeholder="Enter quality check notes, issues found, or corrective actions needed..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={handleSaveQualityCheck}>
          Save Quality Check
        </Button>

        {existingQualityCheck.lastChecked && (
          <p className="text-sm text-muted-foreground">
            Last checked: {new Date(existingQualityCheck.lastChecked).toLocaleString()}
          </p>
        )}
      </div>
    </Card>
  );
}
