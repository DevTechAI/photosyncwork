
import { useState } from "react";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { scheduledEventToDb } from "@/utils/supabaseConverters";

export function useProductionTeamAssignment(
  events: ScheduledEvent[],
  setEvents: React.Dispatch<React.SetStateAction<ScheduledEvent[]>>,
  selectedEvent: ScheduledEvent | null,
  setSelectedEvent: React.Dispatch<React.SetStateAction<ScheduledEvent | null>>
) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const handleAssignTeamMember = async (
    eventId: string,
    teamMemberId: string,
    role: string
  ) => {
    if (!eventId || !teamMemberId) return;
    
    setLoading(true);
    
    try {
      const event = events.find(e => e.id === eventId);
      if (!event) {
        throw new Error("Event not found");
      }
      
      // Check if already assigned
      const isAlreadyAssigned = event.assignments.some(
        assignment => assignment.teamMemberId === teamMemberId
      );
      
      if (isAlreadyAssigned) {
        toast({
          title: "Already assigned",
          description: "This team member is already assigned to the event",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      // Create new assignment
      const newAssignment = {
        eventId,
        eventName: event.name,
        date: event.date,
        location: event.location,
        teamMemberId,
        status: "pending",
        notes: `Assigned as ${role}`
      };
      
      // Add to event assignments
      const updatedEvent = {
        ...event,
        assignments: [...event.assignments, newAssignment]
      };
      
      // Update in Supabase
      try {
        const dbEvent = scheduledEventToDb(updatedEvent);
        const { error } = await supabase
          .from('scheduled_events')
          .update(dbEvent)
          .eq('id', eventId);
          
        if (error) {
          console.error("Error updating event in Supabase:", error);
          throw new Error("Database error");
        }
      } catch (dbError) {
        console.error("Database error:", dbError);
        // Continue with local updates even if DB fails
      }
      
      // Update local state
      const updatedEvents = events.map(e => 
        e.id === eventId ? updatedEvent : e
      );
      
      setEvents(updatedEvents);
      
      // Update selected event if it's the current one
      if (selectedEvent && selectedEvent.id === eventId) {
        setSelectedEvent(updatedEvent);
      }
      
      toast({
        title: "Team Member Assigned",
        description: `Successfully assigned team member as ${role}`
      });
    } catch (error) {
      console.error("Error in handleAssignTeamMember:", error);
      toast({
        title: "Error",
        description: "Failed to assign team member",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateAssignmentStatus = async (
    eventId: string,
    teamMemberId: string,
    status: "accepted" | "declined" | "pending"
  ) => {
    if (!eventId || !teamMemberId) return;
    
    try {
      const event = events.find(e => e.id === eventId);
      if (!event) return;
      
      // Update the assignment status
      const updatedAssignments = event.assignments.map(assignment => {
        if (assignment.teamMemberId === teamMemberId) {
          return { ...assignment, status };
        }
        return assignment;
      });
      
      const updatedEvent = {
        ...event,
        assignments: updatedAssignments
      };
      
      // Update in Supabase
      try {
        const dbEvent = scheduledEventToDb(updatedEvent);
        const { error } = await supabase
          .from('scheduled_events')
          .update(dbEvent)
          .eq('id', eventId);
          
        if (error) {
          console.error("Error updating assignment status in Supabase:", error);
        }
      } catch (dbError) {
        console.error("Database error:", dbError);
        // Continue with local updates even if DB fails
      }
      
      // Update local state
      const updatedEvents = events.map(e => 
        e.id === eventId ? updatedEvent : e
      );
      
      setEvents(updatedEvents);
      
      // Update selected event if it's the current one
      if (selectedEvent && selectedEvent.id === eventId) {
        setSelectedEvent(updatedEvent);
      }
      
      toast({
        title: `Assignment ${status === "pending" ? "Status Changed" : status}`,
        description: `Assignment has been ${status === "pending" ? "updated" : status}`
      });
    } catch (error) {
      console.error("Error in handleUpdateAssignmentStatus:", error);
      toast({
        title: "Error",
        description: "Failed to update assignment status",
        variant: "destructive"
      });
    }
  };
  
  return {
    loading,
    handleAssignTeamMember,
    handleUpdateAssignmentStatus
  };
}
