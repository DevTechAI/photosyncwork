
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamManagement } from "@/components/team/TeamManagement";
import { CreateEventModal } from "@/components/scheduling/CreateEventModal";
import { ScheduledEvent, TeamMember, EventAssignment, WorkflowStage } from "@/components/scheduling/types";
import { SchedulingOverview } from "./components/SchedulingOverview";
import { PreProductionTab } from "./components/PreProductionTab";
import { ProductionTab } from "./components/ProductionTab";
import { PostProductionTab } from "./components/PostProductionTab";
import { WorkflowSidebar } from "./components/WorkflowSidebar";

// Mock data for demonstration
const mockEvents: ScheduledEvent[] = [
  {
    id: "evt-1",
    estimateId: "est-001",
    name: "Sharma Wedding - Engagement",
    date: "2024-05-15",
    startTime: "10:00",
    endTime: "14:00",
    location: "Taj Hotel, Mumbai",
    clientName: "Rahul Sharma",
    clientPhone: "+91 98765 43210",
    photographersCount: 2,
    videographersCount: 1,
    stage: "pre-production",
    assignments: [
      {
        eventId: "evt-1",
        eventName: "Sharma Wedding - Engagement",
        date: "2024-05-15",
        location: "Taj Hotel, Mumbai",
        teamMemberId: "tm-1",
        status: "accepted",
        notes: "Lead photographer"
      }
    ],
    clientRequirements: "Client wants candid shots of the couple. Traditional style engagement photos."
  },
  {
    id: "evt-2",
    estimateId: "est-002",
    name: "Corporate Event - Annual Meeting",
    date: "2024-05-20",
    startTime: "09:00",
    endTime: "17:00",
    location: "Hyatt Regency, Delhi",
    clientName: "Tech Solutions Ltd",
    clientPhone: "+91 99999 88888",
    photographersCount: 1,
    videographersCount: 2,
    stage: "production",
    assignments: [],
    timeTracking: [
      {
        teamMemberId: "tm-2",
        hoursLogged: 4,
        date: "2024-05-20"
      }
    ]
  },
  {
    id: "evt-3",
    estimateId: "est-003",
    name: "Mehta Family Portrait",
    date: "2024-05-10",
    startTime: "14:00",
    endTime: "16:00",
    location: "Studio 9, Mumbai",
    clientName: "Vijay Mehta",
    clientPhone: "+91 88888 77777",
    photographersCount: 1,
    videographersCount: 0,
    stage: "post-production",
    assignments: [],
    deliverables: [
      {
        id: "del-1",
        type: "photos",
        status: "in-progress",
        assignedTo: "tm-3"
      }
    ]
  }
];

const mockTeamMembers: TeamMember[] = [
  {
    id: "tm-1",
    name: "Ankit Patel",
    role: "photographer",
    email: "ankit@example.com",
    phone: "+91 98765 00001",
    whatsapp: "+91 98765 00001",
    availability: {
      "2024-05-15": "busy",
      "2024-05-16": "available",
      "2024-05-17": "available"
    }
  },
  {
    id: "tm-2",
    name: "Priya Singh",
    role: "videographer",
    email: "priya@example.com",
    phone: "+91 98765 00002",
    availability: {
      "2024-05-15": "available",
      "2024-05-16": "busy",
      "2024-05-17": "busy"
    }
  },
  {
    id: "tm-3",
    name: "Vikram Desai",
    role: "editor",
    email: "vikram@example.com",
    phone: "+91 98765 00003",
    availability: {
      "2024-05-15": "available",
      "2024-05-16": "available",
      "2024-05-17": "available"
    }
  }
];

export default function SchedulingPage() {
  const [events, setEvents] = useState<ScheduledEvent[]>(mockEvents);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [mainTab, setMainTab] = useState("overview");
  
  const handleCreateEvent = (newEvent: ScheduledEvent) => {
    setEvents(prev => [...prev, newEvent]);
    setShowCreateEventModal(false);
  };
  
  const handleAssignTeamMember = (eventId: string, teamMemberId: string, role: string) => {
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
      
      setEvents(updatedEvents);
    }
  };
  
  const handleUpdateAssignmentStatus = (eventId: string, teamMemberId: string, status: "accepted" | "declined") => {
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
    
    setEvents(updatedEvents);
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
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Scheduling</h1>
            <p className="text-sm text-muted-foreground">
              Manage your shoots, team assignments, and workflow
            </p>
          </div>
          <Button onClick={() => setShowCreateEventModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
              <TabsList className="w-full justify-start mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="pre-production">Pre-Production</TabsTrigger>
                <TabsTrigger value="production">Production</TabsTrigger>
                <TabsTrigger value="post-production">Post-Production</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <SchedulingOverview 
                  events={events} 
                  getEventsByStage={getEventsByStage} 
                />
              </TabsContent>
              
              {/* Pre-Production Tab */}
              <TabsContent value="pre-production">
                <PreProductionTab 
                  events={getEventsByStage("pre-production")}
                  teamMembers={teamMembers}
                  onAssignTeamMember={handleAssignTeamMember}
                  onUpdateAssignmentStatus={handleUpdateAssignmentStatus}
                  getAssignmentCounts={getAssignmentCounts}
                />
              </TabsContent>
              
              {/* Production Tab */}
              <TabsContent value="production">
                <ProductionTab 
                  events={getEventsByStage("production")} 
                  teamMembers={teamMembers} 
                />
              </TabsContent>
              
              {/* Post-Production Tab */}
              <TabsContent value="post-production">
                <PostProductionTab 
                  events={getEventsByStage("post-production")} 
                  teamMembers={teamMembers} 
                />
              </TabsContent>
              
              {/* Team Tab */}
              <TabsContent value="team">
                <TeamManagement 
                  teamMembers={teamMembers} 
                  onAddTeamMember={(member) => setTeamMembers(prev => [...prev, member])}
                  onUpdateTeamMember={(updatedMember) => {
                    setTeamMembers(prev => prev.map(m => 
                      m.id === updatedMember.id ? updatedMember : m
                    ));
                  }}
                  onDeleteTeamMember={(id) => {
                    setTeamMembers(prev => prev.filter(m => m.id !== id));
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-4">
            <WorkflowSidebar 
              events={events}
              teamMembers={teamMembers}
              getEventsByStage={getEventsByStage}
            />
          </div>
        </div>
      </div>
      
      <CreateEventModal 
        open={showCreateEventModal}
        onClose={() => setShowCreateEventModal(false)}
        onCreateEvent={handleCreateEvent}
      />
    </Layout>
  );
}
