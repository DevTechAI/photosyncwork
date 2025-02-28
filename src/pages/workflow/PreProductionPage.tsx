
import Layout from "@/components/Layout";
import { useState } from "react";
import { TeamMember } from "@/components/scheduling/types";
import { PreProductionEventList } from "@/components/workflow/pre-production/PreProductionEventList";
import { EventDetailsTabs } from "@/components/workflow/pre-production/EventDetailsTabs";
import { usePreProductionEvents } from "@/hooks/usePreProductionEvents";
import { useClientRequirements } from "@/hooks/useClientRequirements";
import { useTeamAssignmentHandlers, getAvailableTeamMembers, getAssignedTeamMembers } from "@/utils/teamAssignmentUtils";

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
  // Team members data
  const [teamMembers] = useState<TeamMember[]>(mockTeamMembers);
  
  // Events management hook
  const { events, setEvents, selectedEvent, setSelectedEvent } = usePreProductionEvents();
  
  // Client requirements hook
  const { 
    clientRequirements, 
    setClientRequirements, 
    handleSaveRequirements 
  } = useClientRequirements(selectedEvent, setEvents, setSelectedEvent);
  
  // Team assignment handlers
  const { 
    loading, 
    handleAssignTeamMember, 
    handleMoveToProduction 
  } = useTeamAssignmentHandlers(events, setEvents, selectedEvent, setSelectedEvent, teamMembers);
  
  // Filter team members
  const availablePhotographers = getAvailableTeamMembers(teamMembers, selectedEvent, "photographer");
  const availableVideographers = getAvailableTeamMembers(teamMembers, selectedEvent, "videographer");
  const assignedTeamMembers = getAssignedTeamMembers(selectedEvent, teamMembers);
  
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
