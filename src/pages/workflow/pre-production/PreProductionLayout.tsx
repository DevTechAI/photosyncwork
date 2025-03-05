
import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
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
import { TeamManagement } from "@/components/scheduling/TeamManagement";

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
  // Team members data - now with persisted storage
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  
  // Load team members from localStorage on component mount
  useEffect(() => {
    try {
      const savedTeamMembers = localStorage.getItem('teamMembers');
      if (savedTeamMembers) {
        setTeamMembers(JSON.parse(savedTeamMembers));
      } else {
        // If no saved team members, use the mock data
        setTeamMembers(mockTeamMembers);
        // Save mock data to localStorage
        localStorage.setItem('teamMembers', JSON.stringify(mockTeamMembers));
      }
    } catch (error) {
      console.error('Error loading team members from localStorage:', error);
      setTeamMembers(mockTeamMembers);
    }
  }, []);
  
  // Save teamMembers to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
    } catch (error) {
      console.error('Error saving team members to localStorage:', error);
    }
  }, [teamMembers]);
  
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
    handleMoveToProduction,
    handleUpdateAssignmentStatus
  } = useTeamAssignmentsTab(events, setEvents, selectedEvent, setSelectedEvent, teamMembers);
  
  // Scheduling tab hook
  const {
    getAssignmentCounts,
    handleAssignTeamMemberForScheduling,
    handleUpdateAssignmentStatus: handleUpdateSchedulingStatus
  } = useSchedulingTab(events, setEvents, teamMembers);

  // Handle adding a team member
  const handleAddTeamMember = (member: TeamMember) => {
    setTeamMembers(prev => [...prev, member]);
  };

  // Handle updating a team member
  const handleUpdateTeamMember = (updatedMember: TeamMember) => {
    setTeamMembers(prev => 
      prev.map(m => m.id === updatedMember.id ? updatedMember : m)
    );
  };

  // Handle deleting a team member
  const handleDeleteTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
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
            <TabsTrigger value="team">Team Management</TabsTrigger>
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
                handleUpdateAssignmentStatus={handleUpdateAssignmentStatus}
              />
            )}
          </TabsContent>
          
          <TabsContent value="scheduling">
            <EventAssignments 
              events={events}
              teamMembers={teamMembers} 
              onAssign={handleAssignTeamMemberForScheduling}
              onUpdateStatus={handleUpdateSchedulingStatus}
              getAssignmentCounts={getAssignmentCounts}
            />
          </TabsContent>

          <TabsContent value="team">
            <TeamManagement 
              teamMembers={teamMembers} 
              onAddTeamMember={handleAddTeamMember}
              onUpdateTeamMember={handleUpdateTeamMember}
              onDeleteTeamMember={handleDeleteTeamMember}
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
