
import Layout from "@/components/Layout";
import { useState } from "react";
import { TeamMember } from "@/components/scheduling/types";
import { PreProductionEventList } from "@/components/workflow/pre-production/PreProductionEventList";
import { EventDetailsTabs } from "@/components/workflow/pre-production/EventDetailsTabs";
import { CompletedPreProductionEvents } from "@/components/workflow/pre-production/CompletedPreProductionEvents";
import { usePreProductionEvents } from "@/hooks/usePreProductionEvents";
import { useClientRequirements } from "@/hooks/useClientRequirements";
import { useTeamAssignmentHandlers, getAvailableTeamMembers, getAssignedTeamMembers } from "@/utils/teamAssignmentUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PreProductionTab } from "@/pages/scheduling/components/PreProductionTab";

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
  const [activeTab, setActiveTab] = useState("details");
  
  // Events management hook
  const { 
    isLoading,
    events, 
    setEvents, 
    completedEvents, 
    selectedEvent, 
    setSelectedEvent,
    deleteCompletedEvent
  } = usePreProductionEvents();
  
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

  // Assignment counts function for the PreProductionTab
  const getAssignmentCounts = (event: any) => {
    const photographers = event.assignments?.filter((a: any) => a.role === "photographer") || [];
    const videographers = event.assignments?.filter((a: any) => a.role === "videographer") || [];
    
    return {
      acceptedPhotographers: photographers.filter((a: any) => a.status === "accepted").length,
      acceptedVideographers: videographers.filter((a: any) => a.status === "accepted").length,
      pendingPhotographers: photographers.filter((a: any) => a.status === "pending").length,
      pendingVideographers: videographers.filter((a: any) => a.status === "pending").length,
      totalPhotographers: event.requiredPhotographers || 0,
      totalVideographers: event.requiredVideographers || 0
    };
  };
  
  // Handler for assignment
  const handleAssignTeamMemberForScheduling = (eventId: string, teamMemberId: string, role: string) => {
    const eventToUpdate = events.find(e => e.id === eventId);
    if (eventToUpdate && teamMemberId && role) {
      handleAssignTeamMember(teamMemberId, role as "photographer" | "videographer");
    }
  };
  
  // Handler for updating assignment status
  const handleUpdateAssignmentStatus = (eventId: string, teamMemberId: string, status: "accepted" | "declined") => {
    const eventToUpdate = events.find(e => e.id === eventId);
    if (eventToUpdate) {
      const updatedAssignments = eventToUpdate.assignments.map(a => {
        if (a.teamMemberId === teamMemberId) {
          return { ...a, status };
        }
        return a;
      });
      
      const updatedEvent = { ...eventToUpdate, assignments: updatedAssignments };
      const updatedEvents = events.map(e => e.id === eventId ? updatedEvent : e);
      setEvents(updatedEvents);
    }
  };
  
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Event Details</TabsTrigger>
            <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
                <div className="lg:col-span-2">
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Event List */}
                <div>
                  <PreProductionEventList 
                    events={events}
                    selectedEvent={selectedEvent}
                    setSelectedEvent={setSelectedEvent}
                  />
                  
                  {/* Completed Events Section */}
                  {completedEvents.length > 0 && (
                    <div className="mt-6">
                      <CompletedPreProductionEvents 
                        completedEvents={completedEvents}
                        teamMembers={teamMembers}
                        onDelete={deleteCompletedEvent}
                      />
                    </div>
                  )}
                </div>
                
                {/* Event Details and Team Assignment */}
                <div className="lg:col-span-2">
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
            )}
          </TabsContent>
          
          <TabsContent value="scheduling">
            <PreProductionTab 
              events={events}
              teamMembers={teamMembers}
              onAssignTeamMember={handleAssignTeamMemberForScheduling}
              onUpdateAssignmentStatus={handleUpdateAssignmentStatus}
              getAssignmentCounts={getAssignmentCounts}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
