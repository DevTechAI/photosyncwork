
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
        <Label htmlFor="client-email">Client Email</Label>
        <Input
          id="client-email"
          value={eventData.clientEmail}
          onChange={(e) => setEventData({ ...eventData, clientEmail: e.target.value })}
          placeholder="Enter client email"
          type="email"
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

      <div className="space-y-2">
        <Label htmlFor="guest-count">Approximate Guest Count</Label>
        <Input
          id="guest-count"
          value={eventData.guestCount}
          onChange={(e) => setEventData({ ...eventData, guestCount: e.target.value })}
          placeholder="Enter approximate guest count"
          type="number"
        />
      </div>
    </>
  );
}
