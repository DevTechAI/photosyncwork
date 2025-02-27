
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Plus } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpcomingEventsCalendar } from "@/components/scheduling/UpcomingEventsCalendar";
import { EventAssignments } from "@/components/scheduling/EventAssignments";
import { CreateEventModal } from "@/components/scheduling/CreateEventModal";
import { ScheduledEvent, TeamMember, EventAssignment } from "@/components/scheduling/types";

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
  }
];

export default function PreProductionPage() {
  const [events, setEvents] = useState<ScheduledEvent[]>(mockEvents);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [activeTab, setActiveTab] = useState("scheduling");
  
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

  // Filter events to only show pre-production events
  const preProductionEvents = events.filter(event => event.stage === "pre-production");
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Pre-Production</h1>
            <p className="text-sm text-muted-foreground">
              Plan and schedule your upcoming events
            </p>
          </div>
          <Button onClick={() => setShowCreateEventModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start mb-4">
                <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
                <TabsTrigger value="requirements">Client Requirements</TabsTrigger>
              </TabsList>
              
              {/* Scheduling Tab */}
              <TabsContent value="scheduling" className="space-y-4">
                <UpcomingEventsCalendar events={preProductionEvents} />
                
                <div className="mt-8">
                  <h3 className="font-medium text-lg mb-4">Team Assignments</h3>
                  <EventAssignments 
                    events={preProductionEvents}
                    teamMembers={teamMembers} 
                    onAssign={handleAssignTeamMember}
                    onUpdateStatus={handleUpdateAssignmentStatus}
                    getAssignmentCounts={getAssignmentCounts}
                  />
                </div>
              </TabsContent>
              
              {/* Client Requirements Tab */}
              <TabsContent value="requirements" className="space-y-4">
                <h3 className="font-medium text-lg">Client Requirements & References</h3>
                
                {preProductionEvents.length > 0 ? (
                  preProductionEvents.map(event => (
                    <div key={event.id} className="border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{event.name}</h4>
                        <div className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-4 space-y-3">
                        <div>
                          <h5 className="text-sm font-medium">Client Details</h5>
                          <p className="text-sm">{event.clientName} • {event.clientPhone}</p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium">Requirements</h5>
                          <p className="text-sm">{event.clientRequirements || "No requirements added yet"}</p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium">References</h5>
                          {event.references && event.references.length > 0 ? (
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              {event.references.map((ref, index) => (
                                <div key={index} className="h-20 bg-gray-100 rounded flex items-center justify-center">
                                  <span className="text-xs text-gray-500">Reference {index + 1}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No references added</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-8 border rounded-lg">
                    <p className="text-muted-foreground">No pre-production events found</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-4">Event Overview</h3>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Events</span>
                  <span className="font-medium">{preProductionEvents.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">This Week</span>
                  <span className="font-medium">
                    {preProductionEvents.filter(e => {
                      const eventDate = new Date(e.date);
                      const now = new Date();
                      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                      const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
                      return eventDate >= startOfWeek && eventDate <= endOfWeek;
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Team Assigned</span>
                  <span className="font-medium">
                    {preProductionEvents.filter(e => e.assignments.length > 0).length}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {preProductionEvents
                  .filter(event => new Date(event.date) >= new Date())
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 3)
                  .map(event => (
                    <div key={event.id} className="space-y-2 pb-2 border-b last:border-b-0">
                      <p className="font-medium text-sm">{event.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>
                  ))}
                
                {preProductionEvents.filter(event => new Date(event.date) >= new Date()).length === 0 && (
                  <p className="text-sm text-muted-foreground">No upcoming events</p>
                )}
              </div>
            </div>
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
