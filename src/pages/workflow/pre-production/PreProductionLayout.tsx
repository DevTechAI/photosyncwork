
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { PreProductionEventList } from "@/components/workflow/pre-production/PreProductionEventList";
import { EventDetailsTabs } from "@/components/workflow/pre-production/EventDetailsTabs";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { dbToScheduledEvent, scheduledEventToDb } from "@/utils/supabaseConverters";
import { getAvailableTeamMembers, getAssignedTeamMembers } from "@/utils/teamMemberFilterUtils";

export default function PreProductionLayout() {
  const { toast } = useToast();
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ScheduledEvent | null>(null);
  const [clientRequirements, setClientRequirements] = useState("");
  const [loading, setLoading] = useState(true);

  // Load events and team members
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load events
        const { data: eventsData, error: eventsError } = await supabase
          .from('scheduled_events')
          .select('*')
          .eq('stage', 'pre-production')
          .order('date', { ascending: true });

        if (eventsError) {
          console.error('Error loading events:', eventsError);
          toast({
            title: "Error",
            description: "Failed to load events",
            variant: "destructive"
          });
        } else {
          const convertedEvents = eventsData?.map(dbToScheduledEvent) || [];
          setEvents(convertedEvents);
        }

        // Load team members with proper type conversion
        const { data: teamData, error: teamError } = await supabase
          .from('team_members')
          .select('*');

        if (teamError) {
          console.error('Error loading team members:', teamError);
          toast({
            title: "Error",
            description: "Failed to load team members",
            variant: "destructive"
          });
        } else {
          // Convert database team members to frontend type
          const convertedTeamMembers: TeamMember[] = (teamData || []).map(member => ({
            id: member.id,
            name: member.name,
            role: member.role as TeamMember['role'], // Type assertion for role
            email: member.email || '',
            phone: member.phone || '',
            whatsapp: member.whatsapp,
            availability: member.availability as TeamMember['availability'] || {},
            isFreelancer: member.is_freelancer || false
          }));
          setTeamMembers(convertedTeamMembers);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Update client requirements when selected event changes
  useEffect(() => {
    if (selectedEvent) {
      setClientRequirements(selectedEvent.clientRequirements || "");
    }
  }, [selectedEvent]);

  const handleSaveRequirements = async () => {
    if (!selectedEvent) return;

    try {
      const { error } = await supabase
        .from('scheduled_events')
        .update({ clientrequirements: clientRequirements })
        .eq('id', selectedEvent.id);

      if (error) {
        console.error('Error saving requirements:', error);
        toast({
          title: "Error",
          description: "Failed to save client requirements",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Requirements Saved",
          description: "Client requirements have been updated successfully"
        });
        
        // Update local state
        setEvents(prev => prev.map(event => 
          event.id === selectedEvent.id 
            ? { ...event, clientRequirements }
            : event
        ));
        setSelectedEvent(prev => prev ? { ...prev, clientRequirements } : null);
      }
    } catch (error) {
      console.error('Error in handleSaveRequirements:', error);
    }
  };

  const handleAssignTeamMember = async (teamMemberId: string, role: "photographer" | "videographer") => {
    if (!selectedEvent) return;

    try {
      const teamMember = teamMembers.find(t => t.id === teamMemberId);
      if (!teamMember) return;

      const newAssignment = {
        eventId: selectedEvent.id,
        eventName: selectedEvent.name,
        date: selectedEvent.date,
        location: selectedEvent.location,
        teamMemberId,
        status: "pending" as const,
        notes: `Assigned as ${role}`
      };

      const updatedAssignments = [...selectedEvent.assignments, newAssignment];
      
      // Convert to database format using the converter
      const dbEvent = scheduledEventToDb({ ...selectedEvent, assignments: updatedAssignments });
      
      const { error } = await supabase
        .from('scheduled_events')
        .update({ assignments: dbEvent.assignments })
        .eq('id', selectedEvent.id);

      if (error) {
        console.error('Error assigning team member:', error);
        toast({
          title: "Error",
          description: "Failed to assign team member",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Team Member Assigned",
          description: `${teamMember.name} has been assigned to ${selectedEvent.name}`
        });

        // Update local state
        const updatedEvent = { ...selectedEvent, assignments: updatedAssignments };
        setEvents(prev => prev.map(event => 
          event.id === selectedEvent.id ? updatedEvent : event
        ));
        setSelectedEvent(updatedEvent);
      }
    } catch (error) {
      console.error('Error in handleAssignTeamMember:', error);
    }
  };

  const handleMoveToProduction = async () => {
    if (!selectedEvent) return;

    try {
      const { error } = await supabase
        .from('scheduled_events')
        .update({ stage: 'production' })
        .eq('id', selectedEvent.id);

      if (error) {
        console.error('Error moving to production:', error);
        toast({
          title: "Error",
          description: "Failed to move event to production",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Event Moved",
          description: `${selectedEvent.name} has been moved to production`
        });

        // Remove from pre-production list
        setEvents(prev => prev.filter(event => event.id !== selectedEvent.id));
        setSelectedEvent(null);
      }
    } catch (error) {
      console.error('Error in handleMoveToProduction:', error);
    }
  };

  const handleUpdateAssignmentStatus = async (eventId: string, teamMemberId: string, status: "accepted" | "declined") => {
    try {
      const event = events.find(e => e.id === eventId);
      if (!event) return;

      const updatedAssignments = event.assignments.map(assignment =>
        assignment.teamMemberId === teamMemberId
          ? { ...assignment, status }
          : assignment
      );

      // Convert to database format using the converter
      const dbEvent = scheduledEventToDb({ ...event, assignments: updatedAssignments });

      const { error } = await supabase
        .from('scheduled_events')
        .update({ assignments: dbEvent.assignments })
        .eq('id', eventId);

      if (error) {
        console.error('Error updating assignment status:', error);
        toast({
          title: "Error",
          description: "Failed to update assignment status",
          variant: "destructive"
        });
      } else {
        const teamMember = teamMembers.find(m => m.id === teamMemberId);
        if (teamMember) {
          toast({
            title: `Assignment ${status === 'accepted' ? 'Accepted' : 'Declined'}`,
            description: `${teamMember.name} has ${status === 'accepted' ? 'accepted' : 'declined'} the assignment`
          });
        }

        // Update local state
        const updatedEvent = { ...event, assignments: updatedAssignments };
        setEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
        if (selectedEvent?.id === eventId) {
          setSelectedEvent(updatedEvent);
        }
      }
    } catch (error) {
      console.error('Error in handleUpdateAssignmentStatus:', error);
    }
  };

  // Get available team members by role
  const availablePhotographers = getAvailableTeamMembers(teamMembers, selectedEvent, "photographer");
  const availableVideographers = getAvailableTeamMembers(teamMembers, selectedEvent, "videographer");
  
  // Get assigned team members
  const assignedTeamMembers = getAssignedTeamMembers(selectedEvent, teamMembers);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Pre-Production</h1>
          <p className="text-sm text-muted-foreground">
            Plan and prepare for upcoming events
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <PreProductionEventList 
              events={events}
              selectedEvent={selectedEvent}
              setSelectedEvent={setSelectedEvent}
            />
          </div>
          
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
            handleUpdateAssignmentStatus={handleUpdateAssignmentStatus}
          />
        </div>
      </div>
    </Layout>
  );
}
