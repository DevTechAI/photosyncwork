
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Plus, Users } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpcomingEventsCalendar } from "@/components/scheduling/UpcomingEventsCalendar";
import { TeamManagement } from "@/components/scheduling/TeamManagement";
import { EventAssignments } from "@/components/scheduling/EventAssignments";
import { CreateEventModal } from "@/components/scheduling/CreateEventModal";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";

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
    ]
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
    assignments: []
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
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Scheduling</h1>
            <p className="text-sm text-muted-foreground">
              Manage your shoots, team assignments, and event calendar
            </p>
          </div>
          <Button onClick={() => setShowCreateEventModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <Tabs defaultValue="calendar">
              <TabsList className="w-full justify-start mb-4">
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
              </TabsList>
              
              <TabsContent value="calendar" className="space-y-4">
                <UpcomingEventsCalendar events={events} />
              </TabsContent>
              
              <TabsContent value="events" className="space-y-4">
                <div className="space-y-4">
                  {events.map(event => (
                    <div key={event.id} className="flex flex-col p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg">{event.name}</h3>
                        <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {event.photographersCount} Photographers, {event.videographersCount} Videographers
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{event.startTime} - {event.endTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{event.clientName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium text-sm mb-2">Team Assignments</h4>
                        {event.assignments.length > 0 ? (
                          <div className="space-y-2">
                            {event.assignments.map((assignment, index) => {
                              const member = teamMembers.find(tm => tm.id === assignment.teamMemberId);
                              return (
                                <div key={index} className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm">{member?.name}</span>
                                    <span className="text-xs text-muted-foreground capitalize">({member?.role})</span>
                                  </div>
                                  <div className={`px-2 py-1 rounded text-xs ${
                                    assignment.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                                    assignment.status === 'declined' ? 'bg-red-100 text-red-800' : 
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {assignment.status}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No team members assigned yet</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="assignments">
                <EventAssignments 
                  events={events} 
                  teamMembers={teamMembers} 
                  onAssign={handleAssignTeamMember}
                  onUpdateStatus={handleUpdateAssignmentStatus}
                />
              </TabsContent>
              
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
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {events
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
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-4">Team Availability</h3>
              <div className="space-y-2">
                {teamMembers.map(member => (
                  <div key={member.id} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      member.availability[new Date().toISOString().split('T')[0]] === 'available' 
                        ? 'bg-green-500' 
                        : member.availability[new Date().toISOString().split('T')[0]] === 'busy' 
                          ? 'bg-red-500' 
                          : 'bg-yellow-500'
                    }`} />
                  </div>
                ))}
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
