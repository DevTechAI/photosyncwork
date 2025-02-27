
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, Camera } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";

// Mock data for demonstration
const mockEvents: ScheduledEvent[] = [
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
      "2024-05-20": "busy",
      "2024-05-21": "available",
      "2024-05-22": "available"
    }
  },
  {
    id: "tm-2",
    name: "Priya Singh",
    role: "videographer",
    email: "priya@example.com",
    phone: "+91 98765 00002",
    availability: {
      "2024-05-20": "busy",
      "2024-05-21": "busy",
      "2024-05-22": "available"
    }
  }
];

export default function ProductionPage() {
  const [events, setEvents] = useState<ScheduledEvent[]>(mockEvents);
  const [teamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [activeTab, setActiveTab] = useState("tracking");
  
  // Filter events to only show production events
  const productionEvents = events.filter(event => event.stage === "production");
  
  // Log additional time for a team member
  const handleLogTime = (eventId: string, teamMemberId: string, hours: number) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        const existingTimeTracking = event.timeTracking || [];
        const today = new Date().toISOString().split('T')[0];
        
        // Check if there's already a time entry for this team member today
        const existingEntryIndex = existingTimeTracking.findIndex(
          entry => entry.teamMemberId === teamMemberId && entry.date === today
        );
        
        if (existingEntryIndex >= 0) {
          // Update existing entry
          const updatedTimeTracking = [...existingTimeTracking];
          updatedTimeTracking[existingEntryIndex] = {
            ...updatedTimeTracking[existingEntryIndex],
            hoursLogged: updatedTimeTracking[existingEntryIndex].hoursLogged + hours
          };
          
          return {
            ...event,
            timeTracking: updatedTimeTracking
          };
        } else {
          // Add new entry
          return {
            ...event,
            timeTracking: [
              ...existingTimeTracking,
              {
                teamMemberId,
                hoursLogged: hours,
                date: today
              }
            ]
          };
        }
      }
      return event;
    }));
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Production</h1>
            <p className="text-sm text-muted-foreground">
              Track ongoing shoots and production activities
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start mb-4">
                <TabsTrigger value="tracking">Time Tracking</TabsTrigger>
                <TabsTrigger value="notes">Production Notes</TabsTrigger>
              </TabsList>
              
              {/* Time Tracking Tab */}
              <TabsContent value="tracking" className="space-y-4">
                <h3 className="font-medium text-lg">Production Time Tracking</h3>
                
                {productionEvents.length > 0 ? (
                  productionEvents.map(event => (
                    <div key={event.id} className="border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{event.name}</h4>
                        <div className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded">
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="text-sm font-medium">Team Hours Logged</h5>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              const teamMemberId = event.assignments[0]?.teamMemberId || teamMembers[0].id;
                              handleLogTime(event.id, teamMemberId, 1);
                            }}
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            Log Hours
                          </Button>
                        </div>
                        
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
              
              {/* Production Notes Tab */}
              <TabsContent value="notes" className="space-y-4">
                <h3 className="font-medium text-lg">Production Notes</h3>
                
                {productionEvents.length > 0 ? (
                  productionEvents.map(event => (
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
          </div>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-4">Event Overview</h3>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Events</span>
                  <span className="font-medium">{productionEvents.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">This Week</span>
                  <span className="font-medium">
                    {productionEvents.filter(e => {
                      const eventDate = new Date(e.date);
                      const now = new Date();
                      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                      const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
                      return eventDate >= startOfWeek && eventDate <= endOfWeek;
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Hours Logged</span>
                  <span className="font-medium">
                    {productionEvents.reduce((total, event) => {
                      if (!event.timeTracking) return total;
                      return total + event.timeTracking.reduce((sum, log) => sum + log.hoursLogged, 0);
                    }, 0)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-4">Today's Shoots</h3>
              <div className="space-y-4">
                {productionEvents
                  .filter(event => {
                    const today = new Date().toISOString().split('T')[0];
                    return event.date === today;
                  })
                  .map(event => (
                    <div key={event.id} className="space-y-2 pb-2 border-b last:border-b-0">
                      <p className="font-medium text-sm">{event.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Camera className="h-3 w-3" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                    </div>
                  ))}
                
                {productionEvents.filter(event => {
                  const today = new Date().toISOString().split('T')[0];
                  return event.date === today;
                }).length === 0 && (
                  <p className="text-sm text-muted-foreground">No shoots scheduled today</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
