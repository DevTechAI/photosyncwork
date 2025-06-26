
import { useState, useEffect } from "react";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { scheduledEventToDb, dbToScheduledEvent } from "@/utils/supabaseConverters";
import { useTeamMembersData } from "@/hooks/useTeamMembersData";
import { getAllEvents } from "@/components/scheduling/utils/eventLoaders";

export function useUnifiedWorkflowManager() {
  const { toast } = useToast();
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ScheduledEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStage, setActiveStage] = useState<"planning" | "pre-production" | "production" | "post-production">("planning");
  
  // Get team members data
  const { 
    teamMembers, 
    handleAddTeamMember, 
    handleUpdateTeamMember, 
    handleDeleteTeamMember 
  } = useTeamMembersData();

  // Load events on mount
  useEffect(() => {
    loadAllEvents();
  }, []);

  const loadAllEvents = async () => {
    setIsLoading(true);
    try {
      const allEvents = await getAllEvents();
      setEvents(allEvents);
    } catch (error) {
      console.error("Error loading events:", error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get events by stage
  const getEventsByStage = (stage: "pre-production" | "production" | "post-production" | "completed") => {
    return events.filter(event => event.stage === stage);
  };

  // Create new event
  const handleCreateEvent = async (newEvent: ScheduledEvent) => {
    try {
      const dbEvent = scheduledEventToDb(newEvent);
      
      const { error } = await supabase
        .from('scheduled_events')
        .insert(dbEvent);
      
      if (error) {
        console.error("Error creating event:", error);
        toast({
          title: "Error",
          description: "Failed to create event",
          variant: "destructive"
        });
        return;
      }
      
      setEvents(prev => [...prev, newEvent]);
      toast({
        title: "Event Created",
        description: `${newEvent.name} has been created successfully.`
      });
    } catch (error) {
      console.error("Error in handleCreateEvent:", error);
    }
  };

  // Update event
  const handleUpdateEvent = async (updatedEvent: ScheduledEvent) => {
    try {
      const dbEvent = scheduledEventToDb(updatedEvent);
      
      const { error } = await supabase
        .from('scheduled_events')
        .update(dbEvent)
        .eq('id', updatedEvent.id);
      
      if (error) {
        console.error("Error updating event:", error);
        return;
      }
      
      setEvents(prev => prev.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      ));
      
      if (selectedEvent && selectedEvent.id === updatedEvent.id) {
        setSelectedEvent(updatedEvent);
      }
    } catch (error) {
      console.error("Error in handleUpdateEvent:", error);
    }
  };

  // Move event to next stage
  const handleMoveToNextStage = async (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    let nextStage: "pre-production" | "production" | "post-production" | "completed";
    
    switch (event.stage) {
      case "pre-production":
        nextStage = "production";
        break;
      case "production":
        nextStage = "post-production";
        break;
      case "post-production":
        nextStage = "completed";
        break;
      default:
        return;
    }

    const updatedEvent = { ...event, stage: nextStage };
    await handleUpdateEvent(updatedEvent);
    
    toast({
      title: "Stage Updated",
      description: `${event.name} moved to ${nextStage.replace('-', ' ')}`
    });
  };

  // Assign team member
  const handleAssignTeamMember = async (eventId: string, teamMemberId: string, role: string) => {
    const event = events.find(e => e.id === eventId);
    const teamMember = teamMembers.find(t => t.id === teamMemberId);
    
    if (!event || !teamMember) return;

    const newAssignment = {
      eventId,
      eventName: event.name,
      date: event.date,
      location: event.location,
      teamMemberId,
      status: "pending" as const,
      notes: `Assigned as ${role}`
    };

    const updatedEvent = {
      ...event,
      assignments: [...event.assignments, newAssignment]
    };

    await handleUpdateEvent(updatedEvent);
    
    toast({
      title: "Team Member Assigned",
      description: `${teamMember.name} assigned to ${event.name}`
    });
  };

  // Update assignment status
  const handleUpdateAssignmentStatus = async (
    eventId: string, 
    teamMemberId: string, 
    status: "accepted" | "declined" | "pending"
  ) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

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

    await handleUpdateEvent(updatedEvent);
  };

  // Log time for team member
  const handleLogTime = async (eventId: string, teamMemberId: string, hours: number) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const existingTimeTracking = event.timeTracking || [];
    const today = new Date().toISOString().split('T')[0];
    
    const existingEntryIndex = existingTimeTracking.findIndex(
      entry => entry.teamMemberId === teamMemberId && entry.date === today
    );

    let updatedTimeTracking;
    if (existingEntryIndex >= 0) {
      updatedTimeTracking = [...existingTimeTracking];
      updatedTimeTracking[existingEntryIndex] = {
        ...updatedTimeTracking[existingEntryIndex],
        hoursLogged: updatedTimeTracking[existingEntryIndex].hoursLogged + hours
      };
    } else {
      updatedTimeTracking = [
        ...existingTimeTracking,
        {
          teamMemberId,
          hoursLogged: hours,
          date: today
        }
      ];
    }

    const updatedEvent = {
      ...event,
      timeTracking: updatedTimeTracking
    };

    await handleUpdateEvent(updatedEvent);
    
    toast({
      title: "Time Logged",
      description: `${hours} hours logged successfully`
    });
  };

  // Get assignment counts
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

  return {
    // State
    events,
    selectedEvent,
    isLoading,
    activeStage,
    teamMembers,
    
    // Actions
    setSelectedEvent,
    setActiveStage,
    loadAllEvents,
    getEventsByStage,
    handleCreateEvent,
    handleUpdateEvent,
    handleMoveToNextStage,
    handleAssignTeamMember,
    handleUpdateAssignmentStatus,
    handleLogTime,
    getAssignmentCounts,
    
    // Team management
    handleAddTeamMember,
    handleUpdateTeamMember,
    handleDeleteTeamMember
  };
}
