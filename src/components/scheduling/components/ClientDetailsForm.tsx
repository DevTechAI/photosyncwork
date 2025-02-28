
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
          value={eventData.clientName || ""}
          onChange={(e) => setEventData({ ...eventData, clientName: e.target.value })}
          placeholder="Enter client name"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="client-phone">Phone</Label>
          <Input
            id="client-phone"
            value={eventData.clientPhone || ""}
            onChange={(e) => setEventData({ ...eventData, clientPhone: e.target.value })}
            placeholder="Client phone number"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="client-email">Email</Label>
          <Input
            id="client-email"
            type="email"
            value={eventData.clientEmail || ""}
            onChange={(e) => setEventData({ ...eventData, clientEmail: e.target.value })}
            placeholder="Client email address"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="event-guests">Estimated Guest Count</Label>
        <Input
          id="event-guests"
          value={eventData.guestCount || ""}
          onChange={(e) => setEventData({ ...eventData, guestCount: e.target.value })}
          placeholder="Approximate number of guests"
        />
      </div>
    </>
  );
}
