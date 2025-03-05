
import Layout from "@/components/Layout";
import { useState } from "react";
import { CreateEventModal } from "@/components/scheduling/CreateEventModal";
import { SchedulingHeader } from "./components/SchedulingHeader";
import { SchedulingTabs } from "./components/SchedulingTabs";
import { WorkflowSidebar } from "./components/WorkflowSidebar";
import { useSchedulingPage } from "@/hooks/useSchedulingPage";

// Mock data for demonstration
const mockEvents = [
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

const mockTeamMembers = [
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
  const {
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
  } = useSchedulingPage(mockEvents, mockTeamMembers);
  
  return (
    <Layout>
      <div className="space-y-6">
        <SchedulingHeader onCreateEvent={() => setShowCreateEventModal(true)} />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <SchedulingTabs
              activeTab={mainTab}
              onTabChange={setMainTab}
              events={events}
              teamMembers={teamMembers}
              getEventsByStage={getEventsByStage}
              onAssignTeamMember={handleAssignTeamMember}
              onUpdateAssignmentStatus={handleUpdateAssignmentStatus}
              getAssignmentCounts={getAssignmentCounts}
              onUpdateTeamMember={(updatedMember) => {
                setTeamMembers(prev => prev.map(m => 
                  m.id === updatedMember.id ? updatedMember : m
                ));
              }}
              onAddTeamMember={(member) => setTeamMembers(prev => [...prev, member])}
              onDeleteTeamMember={(id) => {
                setTeamMembers(prev => prev.filter(m => m.id !== id));
              }}
            />
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
