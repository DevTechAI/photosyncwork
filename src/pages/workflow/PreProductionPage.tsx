
import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { useTeamNotifications } from "@/components/scheduling/utils/notificationHelpers";
import { PreProductionEventList } from "@/components/workflow/pre-production/PreProductionEventList";
import { EventDetailsTabs } from "@/components/workflow/pre-production/EventDetailsTabs";
import { createEventsFromApprovedEstimates, getEventsByStage } from "@/components/scheduling/utils/eventHelpers";

// Mock data for demonstration
const mockTeamMembers: TeamMember[] = [
  {
    id: "tm-1",
    name: "Ankit Patel",
    role: "photographer",
    email: "ankit@example.com",
    phone: "+91 98765 00001",
    whatsapp: "+91 98765 00001",
    availability: {
      "2023-05-20": "busy",
      "2023-05-21": "available",
      "2023-05-22": "available"
    }
  },
  {
    id: "tm-2",
    name: "Priya Singh",
    role: "videographer",
    email: "priya@example.com",
    phone: "+91 98765 00002",
    availability: {
      "2023-05-20": "busy",
      "2023-05-21": "busy",
      "2023-05-22": "available"
    }
  },
  {
    id: "tm-3",
    name: "Raj Kumar",
    role: "photographer",
    email: "raj@example.com",
    phone: "+91 98765 00003",
    availability: {
      "2023-05-20": "available",
      "2023-05-21": "available",
      "2023-05-22": "available"
    },
    isFreelancer: true
  }
];

export default function PreProductionPage() {
  const { toast } = useToast();
  const { sendAssignmentNotification } = useTeamNotifications();
  
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [teamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [selectedEvent, setSelectedEvent] = useState<ScheduledEvent | null>(null);
  const [clientRequirements, setClientRequirements] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Load events from localStorage on mount and check for approved estimates
  useEffect(() => {
    // First, check for any approved estimates that need to be converted to events
    const newEvents = createEventsFromApprovedEstimates();
    
    if (newEvents.length > 0) {
      toast({
        title: "New Events Created",
        description: `${newEvents.length} new event(s) created from approved estimates.`
      });
    }
    
    // Get all pre-production events
    const preProductionEvents = getEventsByStage("pre-production");
    setEvents(preProductionEvents);
  }, [toast]);
  
  // Save events to localStorage whenever they change
  useEffect(() => {
    if (events.length > 0) {
      // Get all existing events first
      const savedEvents = localStorage.getItem("scheduledEvents");
      let allEvents: ScheduledEvent[] = [];
      
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents);
        // Filter out pre-production events that are already in our state
        allEvents = parsedEvents.filter(
          (event: ScheduledEvent) => 
            event.stage !== "pre-production" || 
            !events.some(e => e.id === event.id)
        );
      }
      
      // Add our pre-production events
      localStorage.setItem("scheduledEvents", JSON.stringify([...allEvents, ...events]));
    }
  }, [events]);
  
  // Update selected event when client requirements change
  useEffect(() => {
    if (selectedEvent) {
      setClientRequirements(selectedEvent.clientRequirements || "");
    } else {
      setClientRequirements("");
    }
  }, [selectedEvent]);
  
  const handleSaveRequirements = () => {
    if (!selectedEvent) return;
    
    setEvents(prev => 
      prev.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, clientRequirements } 
          : event
      )
    );
    
    setSelectedEvent(prev => 
      prev ? { ...prev, clientRequirements } : null
    );
    
    toast({
      title: "Requirements Saved",
      description: "Client requirements have been updated successfully."
    });
  };
  
  const handleAssignTeamMember = async (teamMemberId: string, role: "photographer" | "videographer") => {
    if (!selectedEvent) return;
    
    setLoading(true);
    
    try {
      const teamMember = teamMembers.find(tm => tm.id === teamMemberId);
      if (!teamMember) throw new Error("Team member not found");
      
      // Create a new assignment
      const newAssignment = {
        eventId: selectedEvent.id,
        eventName: selectedEvent.name,
        date: selectedEvent.date,
        location: selectedEvent.location,
        teamMemberId,
        status: "pending" as const,
        reportingTime: selectedEvent.startTime
      };
      
      // Add assignment to the event
      const updatedEvent = {
        ...selectedEvent,
        assignments: [...selectedEvent.assignments, newAssignment]
      };
      
      // Update events state
      setEvents(prev => 
        prev.map(event => 
          event.id === selectedEvent.id ? updatedEvent : event
        )
      );
      
      setSelectedEvent(updatedEvent);
      
      // Send notification to team member
      await sendAssignmentNotification(updatedEvent, newAssignment, teamMember);
      
      toast({
        title: "Team Member Assigned",
        description: `${teamMember.name} has been assigned to the event and notified.`
      });
    } catch (error) {
      console.error("Error assigning team member:", error);
      toast({
        title: "Assignment Failed",
        description: "There was an error assigning the team member.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleMoveToProduction = () => {
    if (!selectedEvent) return;
    
    // Check if there are enough team members assigned
    const photographersAssigned = selectedEvent.assignments.filter(
      a => teamMembers.find(tm => tm.id === a.teamMemberId)?.role === "photographer"
    ).length;
    
    const videographersAssigned = selectedEvent.assignments.filter(
      a => teamMembers.find(tm => tm.id === a.teamMemberId)?.role === "videographer"
    ).length;
    
    if (
      photographersAssigned < selectedEvent.photographersCount ||
      videographersAssigned < selectedEvent.videographersCount
    ) {
      toast({
        title: "Insufficient Team Members",
        description: "Please assign the required number of team members before moving to production.",
        variant: "destructive"
      });
      return;
    }
    
    // Update event stage to production
    const updatedEvent = {
      ...selectedEvent,
      stage: "production" as const
    };
    
    // Update events state
    setEvents(prev => prev.filter(event => event.id !== selectedEvent.id));
    
    // Update all events in localStorage
    const savedEvents = localStorage.getItem("scheduledEvents");
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents);
      const updatedEvents = parsedEvents.map((event: ScheduledEvent) =>
        event.id === selectedEvent.id ? updatedEvent : event
      );
      localStorage.setItem("scheduledEvents", JSON.stringify(updatedEvents));
    }
    
    setSelectedEvent(null);
    
    toast({
      title: "Event Moved to Production",
      description: "The event has been moved to the production stage."
    });
  };
  
  const availablePhotographers = teamMembers.filter(
    tm => tm.role === "photographer" && 
    (!selectedEvent || !selectedEvent.assignments.some(a => a.teamMemberId === tm.id))
  );
  
  const availableVideographers = teamMembers.filter(
    tm => tm.role === "videographer" && 
    (!selectedEvent || !selectedEvent.assignments.some(a => a.teamMemberId === tm.id))
  );
  
  const assignedTeamMembers = selectedEvent
    ? selectedEvent.assignments.map(assignment => {
        const teamMember = teamMembers.find(tm => tm.id === assignment.teamMemberId);
        return { 
          ...assignment, 
          teamMember 
        };
      })
    : [];
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Pre-Production</h1>
            <p className="text-sm text-muted-foreground">
              Prepare for upcoming events and assign team members
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Event List */}
          <PreProductionEventList 
            events={events}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
          />
          
          {/* Event Details and Team Assignment */}
          <EventDetailsTabs 
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
            clientRequirements={clientRequirements}
            setClientRequirements={setClientRequirements}
            teamMembers={teamMembers}
            assignedTeamMembers={assignedTeamMembers}
            availablePhotographers={availablePhotographers}
            availableVideographers={availableVideographers}
            loading={loading}
            handleSaveRequirements={handleSaveRequirements}
            handleAssignTeamMember={handleAssignTeamMember}
            handleMoveToProduction={handleMoveToProduction}
          />
        </div>
      </div>
    </Layout>
  );
}
