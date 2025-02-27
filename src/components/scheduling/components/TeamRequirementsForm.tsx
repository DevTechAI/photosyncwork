
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScheduledEvent } from "../types";

interface TeamRequirementsFormProps {
  eventData: Partial<ScheduledEvent>;
  setEventData: (data: Partial<ScheduledEvent>) => void;
}

export function TeamRequirementsForm({ eventData, setEventData }: TeamRequirementsFormProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="photographers">Number of Photographers</Label>
          <Input
            id="photographers"
            type="number"
            min="0"
            value={eventData.photographersCount}
            onChange={(e) => setEventData({ 
              ...eventData, 
              photographersCount: parseInt(e.target.value) || 0 
            })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="videographers">Number of Videographers</Label>
          <Input
            id="videographers"
            type="number"
            min="0"
            value={eventData.videographersCount}
            onChange={(e) => setEventData({ 
              ...eventData, 
              videographersCount: parseInt(e.target.value) || 0 
            })}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="client-requirements">Client Requirements</Label>
        <Input
          id="client-requirements"
          value={eventData.clientRequirements}
          onChange={(e) => setEventData({ ...eventData, clientRequirements: e.target.value })}
          placeholder="Special requests or requirements"
        />
      </div>
    </>
  );
}
