
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Camera,
  Film,
  Book,
  CheckCircle,
  Send,
  Users,
  Edit,
  RotateCcw
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ScheduledEvent, TeamMember, DeliverableAssignment } from "@/components/scheduling/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Mock team members with editor roles
const mockTeamMembers: TeamMember[] = [
  {
    id: "tm-4",
    name: "Vikram Joshi",
    role: "editor",
    email: "vikram@example.com",
    phone: "+91 98765 00004",
    availability: {
      "2023-05-20": "available",
      "2023-05-21": "available",
      "2023-05-22": "available"
    }
  },
  {
    id: "tm-5",
    name: "Divya Sharma",
    role: "editor",
    email: "divya@example.com",
    phone: "+91 98765 00005",
    availability: {
      "2023-05-20": "busy",
      "2023-05-21": "available",
      "2023-05-22": "available"
    }
  },
  {
    id: "tm-6",
    name: "Rahul Verma",
    role: "album_designer",
    email: "rahul@example.com",
    phone: "+91 98765 00006",
    availability: {
      "2023-05-20": "available",
      "2023-05-21": "available",
      "2023-05-22": "busy"
    }
  }
];

export default function PostProductionPage() {
  const { toast } = useToast();
  
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [teamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [selectedEvent, setSelectedEvent] = useState<ScheduledEvent | null>(null);
  const [isDataCopiedModalOpen, setIsDataCopiedModalOpen] = useState(false);
  const [isAssignDeliverableModalOpen, setIsAssignDeliverableModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [selectedDeliverableId, setSelectedDeliverableId] = useState<string | null>(null);
  const [selectedTeamMemberId, setSelectedTeamMemberId] = useState<string>("");
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [revisionNotes, setRevisionNotes] = useState<string>("");
  
  // Load events from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem("scheduledEvents");
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents);
      // Filter only post-production events
      const postProductionEvents = parsedEvents.filter(
        (event: ScheduledEvent) => event.stage === "post-production"
      );
      setEvents(postProductionEvents);
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
        // Filter out post-production events that are already in our state
        allEvents = parsedEvents.filter(
          (event: ScheduledEvent) => 
            event.stage !== "post-production" || 
            !events.some(e => e.id === event.id)
        );
      }
      
      // Add our post-production events
      localStorage.setItem("scheduledEvents", JSON.stringify([...allEvents, ...events]));
    }
  }, [events]);
  
  // Reset form state when selected event changes
  useEffect(() => {
    if (selectedEvent) {
      setIsDataCopiedModalOpen(false);
      setIsAssignDeliverableModalOpen(false);
      setIsRevisionModalOpen(false);
      setSelectedDeliverableId(null);
      setSelectedTeamMemberId("");
      setDeliveryDate("");
      setRevisionNotes("");
    }
  }, [selectedEvent]);
  
  const handleConfirmDataCopied = () => {
    if (!selectedEvent) return;
    
    // Update the event to mark data as copied
    const updatedEvent = {
      ...selectedEvent,
      dataCopied: true
    };
    
    // Update events state
    setEvents(prev => 
      prev.map(event => 
        event.id === selectedEvent.id ? updatedEvent : event
      )
    );
    
    setSelectedEvent(updatedEvent);
    setIsDataCopiedModalOpen(false);
    
    toast({
      title: "Data Copied",
      description: "Event data has been marked as copied and is ready for editing."
    });
  };
  
  const handleOpenAssignModal = (deliverableId: string) => {
    setSelectedDeliverableId(deliverableId);
    
    // Find the deliverable to pre-fill the form
    if (selectedEvent && selectedEvent.deliverables) {
      const deliverable = selectedEvent.deliverables.find(d => d.id === deliverableId);
      if (deliverable) {
        setSelectedTeamMemberId(deliverable.assignedTo || "");
        setDeliveryDate(deliverable.deliveryDate || "");
      }
    }
    
    setIsAssignDeliverableModalOpen(true);
  };
  
  const handleAssignDeliverable = () => {
    if (!selectedEvent || !selectedDeliverableId) return;
    
    // Update the deliverable
    const updatedEvent = {
      ...selectedEvent,
      deliverables: selectedEvent.deliverables?.map(deliverable => 
        deliverable.id === selectedDeliverableId
          ? { 
              ...deliverable, 
              assignedTo: selectedTeamMemberId,
              deliveryDate,
              status: "in-progress" as const
            }
          : deliverable
      )
    };
    
    // Update events state
    setEvents(prev => 
      prev.map(event => 
        event.id === selectedEvent.id ? updatedEvent : event
      )
    );
    
    setSelectedEvent(updatedEvent);
    setIsAssignDeliverableModalOpen(false);
    
    toast({
      title: "Deliverable Assigned",
      description: "The deliverable has been assigned and is now in progress."
    });
  };
  
  const handleUpdateDeliverableStatus = (deliverableId: string, status: "pending" | "in-progress" | "delivered" | "revision-requested" | "completed") => {
    if (!selectedEvent) return;
    
    // Update the deliverable status
    const updatedEvent = {
      ...selectedEvent,
      deliverables: selectedEvent.deliverables?.map(deliverable => 
        deliverable.id === deliverableId
          ? { 
              ...deliverable, 
              status,
              completedDate: status === "completed" ? new Date().toISOString().split('T')[0] : deliverable.completedDate
            }
          : deliverable
      )
    };
    
    // Update events state
    setEvents(prev => 
      prev.map(event => 
        event.id === selectedEvent.id ? updatedEvent : event
      )
    );
    
    setSelectedEvent(updatedEvent);
    
    toast({
      title: "Status Updated",
      description: `Deliverable status has been updated to ${status.replace("-", " ")}.`
    });
  };
  
  const handleOpenRevisionModal = (deliverableId: string) => {
    setSelectedDeliverableId(deliverableId);
    setIsRevisionModalOpen(true);
  };
  
  const handleRequestRevision = () => {
    if (!selectedEvent || !selectedDeliverableId) return;
    
    // Update the deliverable
    const updatedEvent = {
      ...selectedEvent,
      deliverables: selectedEvent.deliverables?.map(deliverable => 
        deliverable.id === selectedDeliverableId
          ? { 
              ...deliverable, 
              status: "revision-requested" as const,
              revisionNotes
            }
          : deliverable
      )
    };
    
    // Update events state
    setEvents(prev => 
      prev.map(event => 
        event.id === selectedEvent.id ? updatedEvent : event
      )
    );
    
    setSelectedEvent(updatedEvent);
    setIsRevisionModalOpen(false);
    
    toast({
      title: "Revision Requested",
      description: "A revision has been requested for the deliverable."
    });
  };
  
  const handleCompleteAllDeliverables = () => {
    if (!selectedEvent) return;
    
    // Check if all deliverables are completed
    const allCompleted = selectedEvent.deliverables?.every(d => d.status === "completed");
    
    if (!allCompleted) {
      toast({
        title: "Cannot Complete Event",
        description: "All deliverables must be completed before moving the event to completed status.",
        variant: "destructive"
      });
      return;
    }
    
    // Update event stage to completed
    const updatedEvent = {
      ...selectedEvent,
      stage: "completed" as const
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
      title: "Event Completed",
      description: "All deliverables are completed and the event has been marked as completed."
    });
  };
  
  const getDeliverableTypeIcon = (type: string) => {
    switch (type) {
      case "photos":
        return <Camera className="h-4 w-4" />;
      case "videos":
        return <Film className="h-4 w-4" />;
      case "album":
        return <Book className="h-4 w-4" />;
      default:
        return <Camera className="h-4 w-4" />;
    }
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-yellow-100 text-yellow-800";
      case "revision-requested":
        return "bg-orange-100 text-orange-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Filter team members by role
  const getTeamMembersByRole = (role: string) => {
    return teamMembers.filter(tm => 
      role === "album" 
        ? tm.role === "album_designer" 
        : tm.role === "editor"
    );
  };
  
  // Check if all deliverables are assigned
  const areAllDeliverablesAssigned = selectedEvent?.deliverables?.every(d => d.assignedTo);
  
  // Check if the event is ready for completion
  const isReadyForCompletion = selectedEvent?.deliverables?.every(d => d.status === "completed");
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Post-Production</h1>
            <p className="text-sm text-muted-foreground">
              Manage editing, deliverables, and client revisions
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Event List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-medium">Post-Production Events</h2>
            
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
                      <Users className="h-4 w-4" />
                      <span>
                        {event.photographersCount} Photographer{event.photographersCount !== 1 ? "s" : ""}, 
                        {event.videographersCount} Videographer{event.videographersCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  
                  {event.dataCopied ? (
                    <div className="mt-2 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-sm inline-block">
                      Data Copied
                    </div>
                  ) : (
                    <div className="mt-2 text-xs bg-red-50 text-red-700 px-2 py-1 rounded-sm inline-block">
                      Data Not Copied
                    </div>
                  )}
                  
                  {event.deliverables && (
                    <div className="mt-2">
                      <div className="text-xs space-x-1">
                        {event.deliverables.filter(d => d.status === "completed").length} / {event.deliverables.length} deliverables completed
                      </div>
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <div className="text-center p-8 border rounded-md">
                <p className="text-muted-foreground">No events in post-production</p>
              </div>
            )}
          </div>
          
          {/* Event Details and Deliverables */}
          <div className="lg:col-span-2">
            {selectedEvent ? (
              <div className="space-y-4">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold">{selectedEvent.name}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{new Date(selectedEvent.date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Client Information</h3>
                      <p className="text-sm mt-1">{selectedEvent.clientName}</p>
                      <p className="text-sm text-muted-foreground">{selectedEvent.clientEmail}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium">Event Package</h3>
                      <p className="text-sm mt-1">
                        {selectedEvent.estimatePackage || "Standard Package"}
                      </p>
                    </div>
                  </div>
                  
                  {!selectedEvent.dataCopied && (
                    <div className="mt-6">
                      <Button onClick={() => setIsDataCopiedModalOpen(true)}>
                        Confirm Data Copied
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        Confirm that all raw footage and photos have been copied and are ready for editing
                      </p>
                    </div>
                  )}
                </Card>
                
                {selectedEvent.dataCopied && (
                  <Card className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium">Deliverables</h2>
                      {areAllDeliverablesAssigned && isReadyForCompletion && (
                        <Button 
                          onClick={handleCompleteAllDeliverables}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Complete All Deliverables
                        </Button>
                      )}
                    </div>
                    
                    {selectedEvent.deliverables && selectedEvent.deliverables.length > 0 ? (
                      <div className="space-y-4">
                        {selectedEvent.deliverables.map(deliverable => (
                          <div 
                            key={deliverable.id} 
                            className="border rounded-md p-4"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                {getDeliverableTypeIcon(deliverable.type)}
                                <span className="font-medium capitalize">
                                  {deliverable.type.charAt(0).toUpperCase() + deliverable.type.slice(1)}
                                </span>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(deliverable.status)}`}>
                                {deliverable.status.replace("-", " ")}
                              </span>
                            </div>
                            
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Assigned To</p>
                                <p className="font-medium">
                                  {deliverable.assignedTo 
                                    ? teamMembers.find(tm => tm.id === deliverable.assignedTo)?.name || "Unknown"
                                    : "Not Assigned"
                                  }
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Delivery Date</p>
                                <p className="font-medium">
                                  {deliverable.deliveryDate 
                                    ? new Date(deliverable.deliveryDate).toLocaleDateString()
                                    : "Not Set"
                                  }
                                </p>
                              </div>
                            </div>
                            
                            {deliverable.revisionNotes && (
                              <div className="mt-3 p-2 bg-orange-50 rounded text-sm">
                                <p className="font-medium text-orange-800">Revision Notes:</p>
                                <p className="text-orange-700">{deliverable.revisionNotes}</p>
                              </div>
                            )}
                            
                            {deliverable.completedDate && (
                              <div className="mt-3 text-xs text-green-600">
                                Completed on {new Date(deliverable.completedDate).toLocaleDateString()}
                              </div>
                            )}
                            
                            <div className="mt-4 flex justify-end space-x-2">
                              {!deliverable.assignedTo && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleOpenAssignModal(deliverable.id)}
                                >
                                  Assign
                                </Button>
                              )}
                              
                              {deliverable.status === "pending" && deliverable.assignedTo && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleUpdateDeliverableStatus(deliverable.id, "in-progress")}
                                >
                                  Start Work
                                </Button>
                              )}
                              
                              {deliverable.status === "in-progress" && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleUpdateDeliverableStatus(deliverable.id, "delivered")}
                                >
                                  Mark Delivered
                                </Button>
                              )}
                              
                              {deliverable.status === "delivered" && (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="border-orange-500 text-orange-500 hover:bg-orange-50"
                                    onClick={() => handleOpenRevisionModal(deliverable.id)}
                                  >
                                    <RotateCcw className="h-3 w-3 mr-1" />
                                    Request Revision
                                  </Button>
                                  
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="border-green-500 text-green-500 hover:bg-green-50"
                                    onClick={() => handleUpdateDeliverableStatus(deliverable.id, "completed")}
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Approve
                                  </Button>
                                </>
                              )}
                              
                              {deliverable.status === "revision-requested" && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleUpdateDeliverableStatus(deliverable.id, "in-progress")}
                                >
                                  Resume Work
                                </Button>
                              )}
                              
                              {deliverable.assignedTo && deliverable.status !== "completed" && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleOpenAssignModal(deliverable.id)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No deliverables found for this event</p>
                    )}
                  </Card>
                )}
              </div>
            ) : (
              <div className="border rounded-lg p-12 text-center">
                <Film className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Select an Event</h3>
                <p className="text-muted-foreground mt-1">
                  Select an event from the list to manage post-production tasks
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Data Copied Confirmation Modal */}
      <Dialog open={isDataCopiedModalOpen} onOpenChange={setIsDataCopiedModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Data Copied</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Please confirm that all raw footage and photos have been copied from memory cards 
              and are safely stored on your system.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDataCopiedModalOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmDataCopied}>Confirm Data Copied</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Assign Deliverable Modal */}
      <Dialog open={isAssignDeliverableModalOpen} onOpenChange={setIsAssignDeliverableModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Deliverable</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {selectedDeliverableId && selectedEvent?.deliverables && (
              <>
                <div className="space-y-2">
                  <Label>Deliverable Type</Label>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    {getDeliverableTypeIcon(
                      selectedEvent.deliverables.find(d => d.id === selectedDeliverableId)?.type || "photos"
                    )}
                    <span className="capitalize">
                      {selectedEvent.deliverables.find(d => d.id === selectedDeliverableId)?.type || ""}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="team-member">Assign To</Label>
                  <Select 
                    value={selectedTeamMemberId} 
                    onValueChange={setSelectedTeamMemberId}
                  >
                    <SelectTrigger id="team-member">
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {getTeamMembersByRole(
                        selectedEvent.deliverables.find(d => d.id === selectedDeliverableId)?.type || "photos"
                      ).map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="delivery-date">Delivery Date</Label>
                  <Input
                    id="delivery-date"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDeliverableModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignDeliverable} disabled={!selectedTeamMemberId || !deliveryDate}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Revision Request Modal */}
      <Dialog open={isRevisionModalOpen} onOpenChange={setIsRevisionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Revision</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="revision-notes">Revision Notes</Label>
              <Textarea
                id="revision-notes"
                placeholder="Enter detailed revision instructions..."
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRevisionModalOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleRequestRevision} 
              disabled={!revisionNotes}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Request Revision
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
