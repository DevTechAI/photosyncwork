
import Layout from "@/components/Layout";
import { useState } from "react";
import { TeamMember } from "@/components/scheduling/types";
import { usePreProductionEvents } from "@/hooks/usePreProductionEvents";
import { useClientRequirements } from "@/hooks/useClientRequirements";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventAssignments } from "@/components/scheduling/assignments/EventAssignments";
import { PreProductionContent } from "./PreProductionContent";
import { useTeamAssignmentsTab } from "@/hooks/useTeamAssignmentsTab";
import { useSchedulingTab } from "@/hooks/useSchedulingTab";
import { useTabState } from "@/hooks/useTabState";

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
  
  // Tab state management
  const { activeTab, setActiveTab } = useTabState("details");
  
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
  
  // Team assignment tab hook
  const {
    loading,
    availablePhotographers,
    availableVideographers,
    assignedTeamMembers,
    handleAssignTeamMember,
    handleMoveToProduction
  } = useTeamAssignmentsTab(events, setEvents, selectedEvent, setSelectedEvent, teamMembers);
  
  // Scheduling tab hook
  const {
    getAssignmentCounts,
    handleAssignTeamMemberForScheduling,
    handleUpdateAssignmentStatus
  } = useSchedulingTab(events, setEvents, teamMembers);
  
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
              <LoadingSkeleton />
            ) : (
              <PreProductionContent 
                events={events}
                completedEvents={completedEvents}
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
                deleteCompletedEvent={deleteCompletedEvent}
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
            )}
          </TabsContent>
          
          <TabsContent value="scheduling">
            <EventAssignments 
              events={events}
              teamMembers={teamMembers} 
              onAssign={handleAssignTeamMemberForScheduling}
              onUpdateStatus={handleUpdateAssignmentStatus}
              getAssignmentCounts={getAssignmentCounts}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

// Loading skeleton component
function LoadingSkeleton() {
  return (
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
  );
}
