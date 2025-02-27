
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScheduledEvent } from "../types";

interface EventBasicDetailsFormProps {
  eventData: Partial<ScheduledEvent>;
  setEventData: (data: Partial<ScheduledEvent>) => void;
}

export function EventBasicDetailsForm({ eventData, setEventData }: EventBasicDetailsFormProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="event-name">Event Name</Label>
        <Input
          id="event-name"
          value={eventData.name}
          onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
          placeholder="Enter event name"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="event-date">Date</Label>
          <Input
            id="event-date"
            type="date"
            value={eventData.date}
            onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="event-location">Location</Label>
          <Input
            id="event-location"
            value={eventData.location}
            onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
            placeholder="Event venue"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="event-start">Start Time</Label>
          <Input
            id="event-start"
            type="time"
            value={eventData.startTime}
            onChange={(e) => setEventData({ ...eventData, startTime: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="event-end">End Time</Label>
          <Input
            id="event-end"
            type="time"
            value={eventData.endTime}
            onChange={(e) => setEventData({ ...eventData, endTime: e.target.value })}
          />
        </div>
      </div>
    </>
  );
}
