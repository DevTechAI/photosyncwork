
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  Info,
  Camera,
  UserCheck,
  Send
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ScheduledEvent, TeamMember, EventAssignment } from "@/components/scheduling/types";
import { useTeamNotifications } from "@/components/scheduling/utils/notificationHelpers";

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
  const { toast } = useToast();
  const { sendAssignmentNotification } = useTeamNotifications();
  
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [teamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [selectedEvent, setSelectedEvent] = useState<ScheduledEvent | null>(null);
  const [clientRequirements, setClientRequirements] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Load events from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem("scheduledEvents");
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents);
      // Filter only pre-production events
      const preProductionEvents = parsedEvents.filter(
        (event: ScheduledEvent) => event.stage === "pre-production"
      );
      setEvents(preProductionEvents);
    }
  }, []);
  
  // Save events to localStorage whenever they change
  useEffect(() => {
    if (events.length > 0) {
      // Get all existing events first
      const savedEvents = localStorage.getItem("scheduledEvents");
      let allEvents: ScheduledEvent[] = [];
      
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents);
        // Filter out pre-production events that are already in our state
        allEvents = parsedEvents.filter(
          (event: ScheduledEvent) => 
            event.stage !== "pre-production" || 
            !events.some(e => e.id === event.id)
        );
      }
      
      // Add our pre-production events
      localStorage.setItem("scheduledEvents", JSON.stringify([...allEvents, ...events]));
    }
  }, [events]);
  
  // Update selected event when client requirements change
  useEffect(() => {
    if (selectedEvent) {
      setClientRequirements(selectedEvent.clientRequirements || "");
    } else {
      setClientRequirements("");
    }
  }, [selectedEvent]);
  
  const handleSaveRequirements = () => {
    if (!selectedEvent) return;
    
    setEvents(prev => 
      prev.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, clientRequirements } 
          : event
      )
    );
    
    setSelectedEvent(prev => 
      prev ? { ...prev, clientRequirements } : null
    );
    
    toast({
      title: "Requirements Saved",
      description: "Client requirements have been updated successfully."
    });
  };
  
  const handleAssignTeamMember = async (teamMemberId: string, role: "photographer" | "videographer") => {
    if (!selectedEvent) return;
    
    setLoading(true);
    
    try {
      const teamMember = teamMembers.find(tm => tm.id === teamMemberId);
      if (!teamMember) throw new Error("Team member not found");
      
      // Create a new assignment
      const newAssignment: EventAssignment = {
        eventId: selectedEvent.id,
        eventName: selectedEvent.name,
        date: selectedEvent.date,
        location: selectedEvent.location,
        teamMemberId,
        status: "pending",
        reportingTime: selectedEvent.startTime
      };
      
      // Add assignment to the event
      const updatedEvent = {
        ...selectedEvent,
        assignments: [...selectedEvent.assignments, newAssignment]
      };
      
      // Update events state
      setEvents(prev => 
        prev.map(event => 
          event.id === selectedEvent.id ? updatedEvent : event
        )
      );
      
      setSelectedEvent(updatedEvent);
      
      // Send notification to team member
      await sendAssignmentNotification(updatedEvent, newAssignment, teamMember);
      
      toast({
        title: "Team Member Assigned",
        description: `${teamMember.name} has been assigned to the event and notified.`
      });
    } catch (error) {
      console.error("Error assigning team member:", error);
      toast({
        title: "Assignment Failed",
        description: "There was an error assigning the team member.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleMoveToProduction = () => {
    if (!selectedEvent) return;
    
    // Check if there are enough team members assigned
    const photographersAssigned = selectedEvent.assignments.filter(
      a => teamMembers.find(tm => tm.id === a.teamMemberId)?.role === "photographer"
    ).length;
    
    const videographersAssigned = selectedEvent.assignments.filter(
      a => teamMembers.find(tm => tm.id === a.teamMemberId)?.role === "videographer"
    ).length;
    
    if (
      photographersAssigned < selectedEvent.photographersCount ||
      videographersAssigned < selectedEvent.videographersCount
    ) {
      toast({
        title: "Insufficient Team Members",
        description: "Please assign the required number of team members before moving to production.",
        variant: "destructive"
      });
      return;
    }
    
    // Update event stage to production
    const updatedEvent = {
      ...selectedEvent,
      stage: "production" as const
    };
    
    // Update events state
    setEvents(prev => prev.filter(event => event.id !== selectedEvent.id));
    
    // Update all events in localStorage
    const savedEvents = localStorage.getItem("scheduledEvents");
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents);
      const updatedEvents = parsedEvents.map((event: ScheduledEvent) =>
        event.id === selectedEvent.id ? updatedEvent : event
      );
      localStorage.setItem("scheduledEvents", JSON.stringify(updatedEvents));
    }
    
    setSelectedEvent(null);
    
    toast({
      title: "Event Moved to Production",
      description: "The event has been moved to the production stage."
    });
  };
  
  const availablePhotographers = teamMembers.filter(
    tm => tm.role === "photographer" && 
    (!selectedEvent || !selectedEvent.assignments.some(a => a.teamMemberId === tm.id))
  );
  
  const availableVideographers = teamMembers.filter(
    tm => tm.role === "videographer" && 
    (!selectedEvent || !selectedEvent.assignments.some(a => a.teamMemberId === tm.id))
  );
  
  const assignedTeamMembers = selectedEvent
    ? selectedEvent.assignments.map(assignment => {
        const teamMember = teamMembers.find(tm => tm.id === assignment.teamMemberId);
        return { 
          ...assignment, 
          teamMember 
        };
      })
    : [];
  
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
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-medium">Upcoming Events</h2>
            
            {events.length > 0 ? (
              events.map(event => (
                <Card
                  key={event.id}
                  className={`p-4 cursor-pointer hover:border-primary transition-colors ${
                    selectedEvent?.id === event.id ? "border-primary" : ""
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <h3 className="font-medium">{event.name}</h3>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>
                        {event.photographersCount} Photographer{event.photographersCount !== 1 ? "s" : ""}, 
                        {event.videographersCount} Videographer{event.videographersCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  
                  {event.estimateId && (
                    <div className="mt-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-sm inline-block">
                      From Estimate #{event.estimateId.substring(0, 8)}
                    </div>
                  )}
                  
                  {event.estimatePackage && (
                    <div className="mt-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-sm inline-block">
                      {event.estimatePackage}
                    </div>
                  )}
                  
                  <div className="mt-2">
                    <span className="text-xs font-medium">
                      Team Assigned: {event.assignments.length} / {event.photographersCount + event.videographersCount}
                    </span>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center p-8 border rounded-md">
                <p className="text-muted-foreground">No upcoming events in pre-production</p>
              </div>
            )}
          </div>
          
          {/* Event Details and Team Assignment */}
          <div className="lg:col-span-2">
            {selectedEvent ? (
              <Tabs defaultValue="details">
                <TabsList className="w-full">
                  <TabsTrigger value="details">Event Details</TabsTrigger>
                  <TabsTrigger value="requirements">Client Requirements</TabsTrigger>
                  <TabsTrigger value="team">Team Assignment</TabsTrigger>
                </TabsList>
                
                {/* Event Details Tab */}
                <TabsContent value="details" className="space-y-4">
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">{selectedEvent.name}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Event Information</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{new Date(selectedEvent.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedEvent.startTime} - {selectedEvent.endTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedEvent.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>Approx. {selectedEvent.guestCount || "Unknown"} guests</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Client Information</h3>
                        <div className="space-y-2">
                          <p><span className="font-medium">Name:</span> {selectedEvent.clientName}</p>
                          <p><span className="font-medium">Phone:</span> {selectedEvent.clientPhone}</p>
                          <p><span className="font-medium">Email:</span> {selectedEvent.clientEmail || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Team Requirements</h3>
                      <div className="flex gap-4">
                        <div className="px-3 py-2 bg-gray-50 rounded-md text-center">
                          <p className="text-sm font-medium">{selectedEvent.photographersCount}</p>
                          <p className="text-xs text-muted-foreground">Photographers</p>
                        </div>
                        <div className="px-3 py-2 bg-gray-50 rounded-md text-center">
                          <p className="text-sm font-medium">{selectedEvent.videographersCount}</p>
                          <p className="text-xs text-muted-foreground">Videographers</p>
                        </div>
                      </div>
                    </div>
                    
                    {selectedEvent.estimateId && (
                      <div className="mt-6 p-3 bg-blue-50 rounded-md">
                        <div className="flex items-start gap-2">
                          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-800">Based on Approved Estimate</p>
                            <p className="text-xs text-blue-600">Estimate #{selectedEvent.estimateId}</p>
                            {selectedEvent.estimatePackage && (
                              <p className="text-xs text-blue-600 mt-1">Package: {selectedEvent.estimatePackage}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {selectedEvent.deliverables && selectedEvent.deliverables.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Deliverables</h3>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {selectedEvent.deliverables.map((deliverable, index) => (
                            <li key={index} className="text-muted-foreground">
                              {deliverable.type === "photos" ? "Photography" : 
                               deliverable.type === "videos" ? "Videography" : 
                               deliverable.type === "album" ? "Wedding Album" : deliverable.type}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Card>
                </TabsContent>
                
                {/* Client Requirements Tab */}
                <TabsContent value="requirements" className="space-y-4">
                  <Card className="p-6">
                    <h2 className="text-lg font-medium mb-4">Client Requirements</h2>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Enter client requirements, expectations, and any special instructions..."
                        value={clientRequirements}
                        onChange={(e) => setClientRequirements(e.target.value)}
                        rows={8}
                      />
                      <Button onClick={handleSaveRequirements}>Save Requirements</Button>
                    </div>
                  </Card>
                </TabsContent>
                
                {/* Team Assignment Tab */}
                <TabsContent value="team" className="space-y-4">
                  <Card className="p-6">
                    <h2 className="text-lg font-medium mb-4">Assigned Team Members</h2>
                    {assignedTeamMembers.length > 0 ? (
                      <div className="space-y-3">
                        {assignedTeamMembers.map((assignment, index) => (
                          <div 
                            key={index} 
                            className="flex justify-between items-center p-3 border rounded-md"
                          >
                            <div>
                              <p className="font-medium">{assignment.teamMember?.name}</p>
                              <p className="text-sm text-muted-foreground capitalize">{assignment.teamMember?.role}</p>
                              {assignment.teamMember?.isFreelancer && (
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                  Freelancer
                                </span>
                              )}
                            </div>
                            <div className="text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                assignment.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                assignment.status === 'declined' ? 'bg-red-100 text-red-800' :
                                assignment.status === 'reassigned' ? 'bg-purple-100 text-purple-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No team members assigned yet</p>
                    )}
                  </Card>
                  
                  <Card className="p-6">
                    <h2 className="text-lg font-medium mb-4">Assign Team Members</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Photographers ({assignedTeamMembers.filter(a => a.teamMember?.role === "photographer").length} / {selectedEvent.photographersCount})</h3>
                        {availablePhotographers.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {availablePhotographers.map(photographer => (
                              <div 
                                key={photographer.id} 
                                className="p-3 border rounded-md flex justify-between items-center"
                              >
                                <div>
                                  <p className="font-medium">{photographer.name}</p>
                                  <p className="text-xs text-muted-foreground">{photographer.phone}</p>
                                  {photographer.isFreelancer && (
                                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                      Freelancer
                                    </span>
                                  )}
                                </div>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleAssignTeamMember(photographer.id, "photographer")}
                                  disabled={loading}
                                >
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  Assign
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No more available photographers</p>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Videographers ({assignedTeamMembers.filter(a => a.teamMember?.role === "videographer").length} / {selectedEvent.videographersCount})</h3>
                        {availableVideographers.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {availableVideographers.map(videographer => (
                              <div 
                                key={videographer.id} 
                                className="p-3 border rounded-md flex justify-between items-center"
                              >
                                <div>
                                  <p className="font-medium">{videographer.name}</p>
                                  <p className="text-xs text-muted-foreground">{videographer.phone}</p>
                                  {videographer.isFreelancer && (
                                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                      Freelancer
                                    </span>
                                  )}
                                </div>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleAssignTeamMember(videographer.id, "videographer")}
                                  disabled={loading}
                                >
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  Assign
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No more available videographers</p>
                        )}
                      </div>
                    </div>
                  </Card>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleMoveToProduction}
                      disabled={
                        assignedTeamMembers.filter(a => a.teamMember?.role === "photographer").length < selectedEvent.photographersCount ||
                        assignedTeamMembers.filter(a => a.teamMember?.role === "videographer").length < selectedEvent.videographersCount
                      }
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Move to Production
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="border rounded-lg p-12 text-center">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Select an Event</h3>
                <p className="text-muted-foreground mt-1">
                  Select an event from the list to view details and assign team members
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
