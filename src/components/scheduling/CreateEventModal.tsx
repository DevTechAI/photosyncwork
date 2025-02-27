
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScheduledEvent } from "./types";

interface CreateEventModalProps {
  open: boolean;
  onClose: () => void;
  onCreateEvent: (event: ScheduledEvent) => void;
}

export function CreateEventModal({ open, onClose, onCreateEvent }: CreateEventModalProps) {
  const [eventData, setEventData] = useState({
    name: "",
    estimateId: "",
    date: "",
    startTime: "09:00",
    endTime: "17:00",
    location: "",
    clientName: "",
    clientPhone: "",
    photographersCount: 1,
    videographersCount: 0,
    notes: "",
    stage: "pre-production" as const, // Default stage
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEvent: ScheduledEvent = {
      id: `evt-${Date.now()}`,
      ...eventData,
      assignments: [],
    };
    
    onCreateEvent(newEvent);
    
    // Reset form
    setEventData({
      name: "",
      estimateId: "",
      date: "",
      startTime: "09:00",
      endTime: "17:00",
      location: "",
      clientName: "",
      clientPhone: "",
      photographersCount: 1,
      videographersCount: 0,
      notes: "",
      stage: "pre-production",
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Event Details */}
          <div className="space-y-2">
            <Label htmlFor="name">Event Name</Label>
            <Input
              id="name"
              name="name"
              value={eventData.name}
              onChange={handleChange}
              placeholder="Wedding, Portrait Session, etc."
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimateId">Estimate ID</Label>
              <Input
                id="estimateId"
                name="estimateId"
                value={eventData.estimateId}
                onChange={handleChange}
                placeholder="EST-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stage">Workflow Stage</Label>
              <Select
                value={eventData.stage}
                onValueChange={(value) => handleSelectChange("stage", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pre-production">Pre-Production</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="post-production">Post-Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={eventData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={eventData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={eventData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              placeholder="Enter event location"
              required
            />
          </div>
          
          {/* Client Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                name="clientName"
                value={eventData.clientName}
                onChange={handleChange}
                placeholder="Client name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientPhone">Client Phone</Label>
              <Input
                id="clientPhone"
                name="clientPhone"
                value={eventData.clientPhone}
                onChange={handleChange}
                placeholder="Client phone number"
              />
            </div>
          </div>
          
          {/* Team Requirements */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="photographersCount">Photographers Needed</Label>
              <Input
                id="photographersCount"
                name="photographersCount"
                type="number"
                min="0"
                value={eventData.photographersCount}
                onChange={handleNumberChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videographersCount">Videographers Needed</Label>
              <Input
                id="videographersCount"
                name="videographersCount"
                type="number"
                min="0"
                value={eventData.videographersCount}
                onChange={handleNumberChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={eventData.notes}
              onChange={handleChange}
              placeholder="Any additional information..."
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
