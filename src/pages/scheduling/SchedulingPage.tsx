
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Plus, Users, AlertTriangle, CheckCircle, FileText, Camera, Film } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpcomingEventsCalendar } from "@/components/scheduling/UpcomingEventsCalendar";
import { TeamManagement } from "@/components/scheduling/TeamManagement";
import { EventAssignments } from "@/components/scheduling/EventAssignments";
import { CreateEventModal } from "@/components/scheduling/CreateEventModal";
import { ScheduledEvent, TeamMember, EventAssignment, WorkflowStage } from "@/components/scheduling/types";

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
        id: "del-1", // Added the required id property
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
  const [preProductionTab, setPreProductionTab] = useState("requirements");
  const [productionTab, setProductionTab] = useState("tracking");
  const [postProductionTab, setPostProductionTab] = useState("deliverables");
  
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
                <UpcomingEventsCalendar events={events} />
                
                {/* Upcoming Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="border rounded-lg p-4 shadow-sm">
                    <h3 className="font-medium text-lg flex items-center gap-2 mb-4">
                      <FileText className="h-5 w-5 text-indigo-500" />
                      <span>Pre-Production</span>
                    </h3>
                    <div className="space-y-3">
                      {getEventsByStage("pre-production").length > 0 ? (
                        getEventsByStage("pre-production").map(event => (
                          <div key={event.id} className="p-2 border-l-2 border-indigo-400 pl-3">
                            <p className="font-medium">{event.name}</p>
                            <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No pre-production events</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 shadow-sm">
                    <h3 className="font-medium text-lg flex items-center gap-2 mb-4">
                      <Camera className="h-5 w-5 text-amber-500" />
                      <span>Production</span>
                    </h3>
                    <div className="space-y-3">
                      {getEventsByStage("production").length > 0 ? (
                        getEventsByStage("production").map(event => (
                          <div key={event.id} className="p-2 border-l-2 border-amber-400 pl-3">
                            <p className="font-medium">{event.name}</p>
                            <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No production events</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 shadow-sm">
                    <h3 className="font-medium text-lg flex items-center gap-2 mb-4">
                      <Film className="h-5 w-5 text-green-500" />
                      <span>Post-Production</span>
                    </h3>
                    <div className="space-y-3">
                      {getEventsByStage("post-production").length > 0 ? (
                        getEventsByStage("post-production").map(event => (
                          <div key={event.id} className="p-2 border-l-2 border-green-400 pl-3">
                            <p className="font-medium">{event.name}</p>
                            <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No post-production events</p>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Pre-Production Tab */}
              <TabsContent value="pre-production">
                <Tabs value={preProductionTab} onValueChange={setPreProductionTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="requirements">Client Requirements</TabsTrigger>
                    <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="requirements" className="space-y-4">
                    <h3 className="font-medium text-lg">Client Requirements & References</h3>
                    
                    {getEventsByStage("pre-production").length > 0 ? (
                      getEventsByStage("pre-production").map(event => (
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
                  
                  <TabsContent value="scheduling">
                    <EventAssignments 
                      events={getEventsByStage("pre-production")}
                      teamMembers={teamMembers} 
                      onAssign={handleAssignTeamMember}
                      onUpdateStatus={handleUpdateAssignmentStatus}
                      getAssignmentCounts={getAssignmentCounts}
                    />
                  </TabsContent>
                </Tabs>
              </TabsContent>
              
              {/* Production Tab */}
              <TabsContent value="production">
                <Tabs value={productionTab} onValueChange={setProductionTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="tracking">Time Tracking</TabsTrigger>
                    <TabsTrigger value="notes">Production Notes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="tracking" className="space-y-4">
                    <h3 className="font-medium text-lg">Production Time Tracking</h3>
                    
                    {getEventsByStage("production").length > 0 ? (
                      getEventsByStage("production").map(event => (
                        <div key={event.id} className="border rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{event.name}</h4>
                            <div className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded">
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="mt-4">
                            <h5 className="text-sm font-medium mb-2">Team Hours Logged</h5>
                            {event.timeTracking && event.timeTracking.length > 0 ? (
                              <div className="space-y-2">
                                {event.timeTracking.map((timeLog, index) => {
                                  const member = teamMembers.find(m => m.id === timeLog.teamMemberId);
                                  return (
                                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                      <div>
                                        <p className="text-sm font-medium">{member?.name || "Unknown"}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{member?.role}</p>
                                      </div>
                                      <div className="text-sm font-medium">
                                        {timeLog.hoursLogged} hours
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">No time tracking data available</p>
                            )}
                          </div>
                          <div className="mt-4">
                            <h5 className="text-sm font-medium mb-2">Team Assignments</h5>
                            {event.assignments.length > 0 ? (
                              <div className="space-y-2">
                                {event.assignments.map((assignment, index) => {
                                  const member = teamMembers.find(tm => tm.id === assignment.teamMemberId);
                                  return (
                                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                      <div>
                                        <p className="text-sm font-medium">{member?.name || "Unknown"}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{member?.role}</p>
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
                      ))
                    ) : (
                      <div className="text-center p-8 border rounded-lg">
                        <p className="text-muted-foreground">No production events found</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="notes" className="space-y-4">
                    <h3 className="font-medium text-lg">Production Notes</h3>
                    
                    {getEventsByStage("production").length > 0 ? (
                      getEventsByStage("production").map(event => (
                        <div key={event.id} className="border rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{event.name}</h4>
                            <div className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded">
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="mt-4">
                            <h5 className="text-sm font-medium mb-2">Client Inputs During Shoot</h5>
                            <p className="text-sm text-muted-foreground">No client inputs recorded</p>
                          </div>
                          <div className="mt-4">
                            <h5 className="text-sm font-medium mb-2">Team Observations</h5>
                            <p className="text-sm text-muted-foreground">No team observations recorded</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-8 border rounded-lg">
                        <p className="text-muted-foreground">No production events found</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </TabsContent>
              
              {/* Post-Production Tab */}
              <TabsContent value="post-production">
                <Tabs value={postProductionTab} onValueChange={setPostProductionTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
                    <TabsTrigger value="revisions">Revisions</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="deliverables" className="space-y-4">
                    <h3 className="font-medium text-lg">Deliverables Tracking</h3>
                    
                    {getEventsByStage("post-production").length > 0 ? (
                      getEventsByStage("post-production").map(event => (
                        <div key={event.id} className="border rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{event.name}</h4>
                            <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="mt-4">
                            <h5 className="text-sm font-medium mb-2">Deliverables</h5>
                            {event.deliverables && event.deliverables.length > 0 ? (
                              <div className="space-y-2">
                                {event.deliverables.map((deliverable, index) => {
                                  const member = teamMembers.find(m => m.id === deliverable.assignedTo);
                                  return (
                                    <div key={index} className="p-3 border rounded-md">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <p className="font-medium capitalize">{deliverable.type}</p>
                                          <p className="text-xs text-muted-foreground">
                                            Assigned to: {member?.name || "Unassigned"}
                                          </p>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-xs ${
                                          deliverable.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                          deliverable.status === 'revision-requested' ? 'bg-amber-100 text-amber-800' : 
                                          deliverable.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                                          'bg-gray-100 text-gray-800'
                                        }`}>
                                          {deliverable.status.split('-').join(' ')}
                                        </div>
                                      </div>
                                      {deliverable.deliveryDate && (
                                        <p className="text-xs mt-2">
                                          Delivery date: {new Date(deliverable.deliveryDate).toLocaleDateString()}
                                        </p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">No deliverables added yet</p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-8 border rounded-lg">
                        <p className="text-muted-foreground">No post-production events found</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="revisions" className="space-y-4">
                    <h3 className="font-medium text-lg">Revision Requests</h3>
                    
                    {getEventsByStage("post-production").length > 0 ? (
                      getEventsByStage("post-production").map(event => (
                        <div key={event.id} className="border rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{event.name}</h4>
                            <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                          </div>
                          {event.deliverables && event.deliverables.some(d => d.status === "revision-requested") ? (
                            <div className="mt-4">
                              <h5 className="text-sm font-medium mb-2">Revision Requests</h5>
                              <div className="space-y-2">
                                {event.deliverables
                                  .filter(d => d.status === "revision-requested")
                                  .map((deliverable, index) => {
                                    const member = teamMembers.find(m => m.id === deliverable.assignedTo);
                                    return (
                                      <div key={index} className="p-3 border rounded-md bg-amber-50">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <p className="font-medium capitalize">{deliverable.type} - Revision Requested</p>
                                            <p className="text-xs text-muted-foreground">
                                              Assigned to: {member?.name || "Unassigned"}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          ) : (
                            <div className="mt-4">
                              <p className="text-sm text-muted-foreground">No revision requests for this event</p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-8 border rounded-lg">
                        <p className="text-muted-foreground">No post-production events found</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
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
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-4">Workflow Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span className="text-sm">Pre-Production</span>
                  </div>
                  <span className="font-medium">{getEventsByStage("pre-production").length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm">Production</span>
                  </div>
                  <span className="font-medium">{getEventsByStage("production").length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Post-Production</span>
                  </div>
                  <span className="font-medium">{getEventsByStage("post-production").length}</span>
                </div>
              </div>
            </div>
            
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
