
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScheduledEvent } from "../types";

interface ClientDetailsFormProps {
  eventData: Partial<ScheduledEvent>;
  setEventData: (data: Partial<ScheduledEvent>) => void;
}

export function ClientDetailsForm({ eventData, setEventData }: ClientDetailsFormProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="client-name">Client Name</Label>
        <Input
          id="client-name"
          value={eventData.clientName}
          onChange={(e) => setEventData({ ...eventData, clientName: e.target.value })}
          placeholder="Enter client name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="client-phone">Client Phone</Label>
        <Input
          id="client-phone"
          value={eventData.clientPhone}
          onChange={(e) => setEventData({ ...eventData, clientPhone: e.target.value })}
          placeholder="Enter client phone number"
        />
      </div>
    </>
  );
}
