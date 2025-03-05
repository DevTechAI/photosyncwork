
import { useState, useEffect } from "react";
import { ScheduledEvent, TeamMember, WorkflowStage, EventAssignment } from "@/components/scheduling/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useSchedulingPage(initialEvents: ScheduledEvent[], initialTeamMembers: TeamMember[]) {
  const { toast } = useToast();
  const [events, setEvents] = useState<ScheduledEvent[]>(initialEvents);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [mainTab, setMainTab] = useState("overview");
  
  const handleCreateEvent = async (newEvent: ScheduledEvent) => {
    try {
      // Insert into Supabase
      const { error } = await supabase
        .from('scheduled_events')
        .insert(newEvent);
      
      if (error) {
        console.error("Error creating event in Supabase:", error);
        toast({
          title: "Error",
          description: "Failed to save event. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      // Update local state
      setEvents(prev => [...prev, newEvent]);
      setShowCreateEventModal(false);
      
      toast({
        title: "Event Created",
        description: `${newEvent.name} has been scheduled successfully.`
      });
    } catch (error) {
      console.error("Error in handleCreateEvent:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleAssignTeamMember = async (eventId: string, teamMemberId: string, role: string) => {
    try {
      const event = events.find(e => e.id === eventId);
      const teamMember = teamMembers.find(t => t.id === teamMemberId);
      
      if (event && teamMember) {
        const newAssignment: EventAssignment = {
          eventId,
          eventName: event.name,
          date: event.date,
          location: event.location,
          teamMemberId,
          status: "pending",
          notes: `Assigned as ${role}`
        };
        
        const updatedEvents = events.map(e => {
          if (e.id === eventId) {
            return {
              ...e,
              assignments: [...e.assignments, newAssignment]
            };
          }
          return e;
        });
        
        // Update in Supabase
        const { error } = await supabase
          .from('scheduled_events')
          .update(updatedEvents.find(e => e.id === eventId) || {})
          .eq('id', eventId);
        
        if (error) {
          console.error("Error updating assignments in Supabase:", error);
          toast({
            title: "Error",
            description: "Failed to assign team member. Please try again.",
            variant: "destructive"
          });
          return;
        }
        
        // Update local state
        setEvents(updatedEvents);
        
        toast({
          title: "Team Member Assigned",
          description: `${teamMember.name} has been assigned to ${event.name}.`
        });
      }
    } catch (error) {
      console.error("Error in handleAssignTeamMember:", error);
    }
  };
  
  const handleUpdateAssignmentStatus = async (eventId: string, teamMemberId: string, status: "accepted" | "declined") => {
    try {
      const updatedEvents = events.map(event => {
        if (event.id === eventId) {
          const updatedAssignments = event.assignments.map(assignment => {
            if (assignment.teamMemberId === teamMemberId) {
              return {
                ...assignment,
                status
              };
            }
            return assignment;
          });
          
          return {
            ...event,
            assignments: updatedAssignments
          };
        }
        return event;
      });
      
      // Update in Supabase
      const updatedEvent = updatedEvents.find(e => e.id === eventId);
      if (updatedEvent) {
        const { error } = await supabase
          .from('scheduled_events')
          .update(updatedEvent)
          .eq('id', eventId);
        
        if (error) {
          console.error("Error updating assignment status in Supabase:", error);
          return;
        }
      }
      
      // Update local state
      setEvents(updatedEvents);
      
      const teamMember = teamMembers.find(m => m.id === teamMemberId);
      const event = events.find(e => e.id === eventId);
      
      if (teamMember && event) {
        toast({
          title: `Assignment ${status === 'accepted' ? 'Accepted' : 'Declined'}`,
          description: `${teamMember.name} has ${status === 'accepted' ? 'accepted' : 'declined'} the assignment for ${event.name}.`
        });
      }
    } catch (error) {
      console.error("Error in handleUpdateAssignmentStatus:", error);
    }
  };

  // Get assignment counts by role and status
  const getAssignmentCounts = (event: ScheduledEvent) => {
    const acceptedPhotographers = event.assignments.filter(
      a => {
        const member = teamMembers.find(m => m.id === a.teamMemberId);
        return member?.role === "photographer" && a.status === "accepted";
      }
    ).length;

    const acceptedVideographers = event.assignments.filter(
      a => {
        const member = teamMembers.find(m => m.id === a.teamMemberId);
        return member?.role === "videographer" && a.status === "accepted";
      }
    ).length;

    const pendingPhotographers = event.assignments.filter(
      a => {
        const member = teamMembers.find(m => m.id === a.teamMemberId);
        return member?.role === "photographer" && a.status === "pending";
      }
    ).length;

    const pendingVideographers = event.assignments.filter(
      a => {
        const member = teamMembers.find(m => m.id === a.teamMemberId);
        return member?.role === "videographer" && a.status === "pending";
      }
    ).length;

    return {
      acceptedPhotographers,
      acceptedVideographers,
      pendingPhotographers,
      pendingVideographers,
      totalPhotographers: acceptedPhotographers + pendingPhotographers,
      totalVideographers: acceptedVideographers + pendingVideographers
    };
  };

  // Filter events by workflow stage
  const getEventsByStage = (stage: WorkflowStage) => {
    return events.filter(event => event.stage === stage);
  };
  
  return {
    events,
    setEvents,
    teamMembers,
    setTeamMembers,
    showCreateEventModal,
    setShowCreateEventModal,
    mainTab,
    setMainTab,
    handleCreateEvent,
    handleAssignTeamMember,
    handleUpdateAssignmentStatus,
    getAssignmentCounts,
    getEventsByStage
  };
}
