
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, Film, Check, Plus } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { useUser } from "@/contexts/UserContext";

// Mock data for demonstration
const mockEvents: ScheduledEvent[] = [
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
        type: "photos",
        status: "in-progress",
        assignedTo: "user-6" // Changed to match user ID
      }
    ]
  }
];

const mockTeamMembers: TeamMember[] = [
  {
    id: "user-6", // Changed to match user ID
    name: "Vikram Desai",
    role: "editor",
    email: "vikram@example.com",
    phone: "+91 98765 00003",
    availability: {
      "2024-05-10": "available",
      "2024-05-11": "available",
      "2024-05-12": "available"
    }
  }
];

export default function PostProductionPage() {
  const [events, setEvents] = useState<ScheduledEvent[]>(mockEvents);
  const [teamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [activeTab, setActiveTab] = useState("deliverables");
  const { currentUser } = useUser();
  
  // Filter events based on user role
  const postProductionEvents = events.filter(event => {
    // If manager or CRM, show all post-production events
    if (currentUser?.role === "manager" || currentUser?.role === "crm") {
      return event.stage === "post-production";
    }
    
    // For editors, only show events assigned to them
    if (currentUser?.role === "editor") {
      return event.stage === "post-production" && 
             event.deliverables?.some(d => d.assignedTo === currentUser.id);
    }
    
    return false;
  });
  
  // Update deliverable status
  const handleUpdateDeliverableStatus = (
    eventId: string, 
    deliverableIndex: number, 
    newStatus: "pending" | "in-progress" | "delivered" | "revision-requested" | "completed"
  ) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId && event.deliverables) {
        const updatedDeliverables = [...event.deliverables];
        updatedDeliverables[deliverableIndex] = {
          ...updatedDeliverables[deliverableIndex],
          status: newStatus,
          ...(newStatus === 'delivered' ? { deliveryDate: new Date().toISOString().split('T')[0] } : {})
        };
        
        return {
          ...event,
          deliverables: updatedDeliverables
        };
      }
      return event;
    }));
  };
  
  // Show different view for editors
  if (currentUser?.role === "editor") {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">My Editing Tasks</h1>
              <p className="text-sm text-muted-foreground">
                Manage your assigned deliverables
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            {postProductionEvents.length > 0 ? (
              postProductionEvents.map(event => (
                <div key={event.id} className="border rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{event.name}</h4>
                    <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h5 className="text-sm font-medium mb-4">My Deliverables</h5>
                    
                    {event.deliverables && event.deliverables.length > 0 ? (
                      <div className="space-y-4">
                        {event.deliverables
                          .filter(d => d.assignedTo === currentUser.id)
                          .map((deliverable, index) => {
                            return (
                              <div key={index} className="p-3 border rounded-md">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium capitalize">{deliverable.type}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Due date: {new Date(event.date).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className={`px-2 py-1 rounded text-xs ${
                                      deliverable.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                      deliverable.status === 'revision-requested' ? 'bg-amber-100 text-amber-800' : 
                                      deliverable.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {deliverable.status.split('-').join(' ')}
                                    </div>
                                    <div className="flex gap-1">
                                      {deliverable.status !== 'completed' && (
                                        <>
                                          {deliverable.status === 'pending' && (
                                            <Button 
                                              variant="ghost" 
                                              size="sm"
                                              onClick={() => {
                                                const allDeliverables = event.deliverables || [];
                                                const actualIndex = allDeliverables.findIndex(
                                                  d => d.type === deliverable.type && 
                                                      d.status === deliverable.status && 
                                                      d.assignedTo === deliverable.assignedTo
                                                );
                                                handleUpdateDeliverableStatus(event.id, actualIndex, 'in-progress');
                                              }}
                                            >
                                              <Edit className="h-3 w-3" />
                                            </Button>
                                          )}
                                          {deliverable.status === 'in-progress' && (
                                            <Button 
                                              variant="ghost" 
                                              size="sm"
                                              onClick={() => {
                                                const allDeliverables = event.deliverables || [];
                                                const actualIndex = allDeliverables.findIndex(
                                                  d => d.type === deliverable.type && 
                                                      d.status === deliverable.status && 
                                                      d.assignedTo === deliverable.assignedTo
                                                );
                                                handleUpdateDeliverableStatus(event.id, actualIndex, 'delivered');
                                              }}
                                            >
                                              <Check className="h-3 w-3" />
                                            </Button>
                                          )}
                                          {deliverable.status === 'revision-requested' && (
                                            <Button 
                                              variant="ghost" 
                                              size="sm"
                                              onClick={() => {
                                                const allDeliverables = event.deliverables || [];
                                                const actualIndex = allDeliverables.findIndex(
                                                  d => d.type === deliverable.type && 
                                                      d.status === deliverable.status && 
                                                      d.assignedTo === deliverable.assignedTo
                                                );
                                                handleUpdateDeliverableStatus(event.id, actualIndex, 'in-progress');
                                              }}
                                            >
                                              <Edit className="h-3 w-3" />
                                            </Button>
                                          )}
                                        </>
                                      )}
                                    </div>
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
                      <p className="text-sm text-muted-foreground">No deliverables assigned to you</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 border rounded-lg">
                <p className="text-muted-foreground">No editing tasks assigned to you</p>
              </div>
            )}
          </div>
        </div>
      </Layout>
    );
  }
  
  // Manager/CRM view with full functionality
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Post-Production</h1>
            <p className="text-sm text-muted-foreground">
              Manage deliverables and client revisions
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start mb-4">
                <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
                <TabsTrigger value="revisions">Revisions</TabsTrigger>
              </TabsList>
              
              {/* Deliverables Tab */}
              <TabsContent value="deliverables" className="space-y-4">
                <h3 className="font-medium text-lg">Deliverables Tracking</h3>
                
                {postProductionEvents.length > 0 ? (
                  postProductionEvents.map(event => (
                    <div key={event.id} className="border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{event.name}</h4>
                        <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="text-sm font-medium">Deliverables</h5>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEvents(prev => prev.map(e => {
                                if (e.id === event.id) {
                                  return {
                                    ...e,
                                    deliverables: [
                                      ...(e.deliverables || []),
                                      {
                                        type: "photos",
                                        status: "pending",
                                        assignedTo: teamMembers[0].id
                                      }
                                    ]
                                  };
                                }
                                return e;
                              }));
                            }}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Deliverable
                          </Button>
                        </div>
                        
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
                                    <div className="flex items-center gap-2">
                                      <div className={`px-2 py-1 rounded text-xs ${
                                        deliverable.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                        deliverable.status === 'revision-requested' ? 'bg-amber-100 text-amber-800' : 
                                        deliverable.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                                        'bg-gray-100 text-gray-800'
                                      }`}>
                                        {deliverable.status.split('-').join(' ')}
                                      </div>
                                      <div className="flex gap-1">
                                        {deliverable.status !== 'completed' && (
                                          <>
                                            {deliverable.status === 'pending' && (
                                              <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => handleUpdateDeliverableStatus(event.id, index, 'in-progress')}
                                              >
                                                <Edit className="h-3 w-3" />
                                              </Button>
                                            )}
                                            {deliverable.status === 'in-progress' && (
                                              <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => handleUpdateDeliverableStatus(event.id, index, 'delivered')}
                                              >
                                                <Check className="h-3 w-3" />
                                              </Button>
                                            )}
                                            {deliverable.status === 'delivered' && (
                                              <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => handleUpdateDeliverableStatus(event.id, index, 'completed')}
                                              >
                                                <Check className="h-3 w-3" />
                                              </Button>
                                            )}
                                            {deliverable.status === 'revision-requested' && (
                                              <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => handleUpdateDeliverableStatus(event.id, index, 'in-progress')}
                                              >
                                                <Edit className="h-3 w-3" />
                                              </Button>
                                            )}
                                          </>
                                        )}
                                      </div>
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
              
              {/* Revisions Tab */}
              <TabsContent value="revisions" className="space-y-4">
                <h3 className="font-medium text-lg">Revision Requests</h3>
                
                {postProductionEvents.length > 0 ? (
                  postProductionEvents.map(event => (
                    <div key={event.id} className="border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{event.name}</h4>
                        <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="text-sm font-medium">Deliverables for Revision</h5>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              if (event.deliverables && event.deliverables.length > 0) {
                                const deliveredIndex = event.deliverables.findIndex(d => d.status === 'delivered');
                                if (deliveredIndex >= 0) {
                                  handleUpdateDeliverableStatus(event.id, deliveredIndex, 'revision-requested');
                                }
                              }
                            }}
                            disabled={!event.deliverables || !event.deliverables.some(d => d.status === 'delivered')}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Request Revision
                          </Button>
                        </div>
                        
                        {event.deliverables && event.deliverables.some(d => d.status === "revision-requested") ? (
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
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => {
                                          const allDeliverables = event.deliverables || [];
                                          const actualIndex = allDeliverables.findIndex(
                                            d => d.type === deliverable.type && 
                                                d.status === "revision-requested" && 
                                                d.assignedTo === deliverable.assignedTo
                                          );
                                          if (actualIndex >= 0) {
                                            handleUpdateDeliverableStatus(event.id, actualIndex, 'in-progress');
                                          }
                                        }}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        ) : (
                          <div className="mt-4">
                            <p className="text-sm text-muted-foreground">No revision requests for this event</p>
                          </div>
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
            </Tabs>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-4">Deliverables Overview</h3>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Events</span>
                  <span className="font-medium">{postProductionEvents.length}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pending Deliverables</span>
                  <span className="font-medium">
                    {postProductionEvents.reduce((total, event) => {
                      if (!event.deliverables) return total;
                      return total + event.deliverables.filter(d => 
                        d.status === 'pending' || d.status === 'in-progress'
                      ).length;
                    }, 0)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Completed</span>
                  <span className="font-medium">
                    {postProductionEvents.reduce((total, event) => {
                      if (!event.deliverables) return total;
                      return total + event.deliverables.filter(d => d.status === 'completed').length;
                    }, 0)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Revision Requests</span>
                  <span className="font-medium">
                    {postProductionEvents.reduce((total, event) => {
                      if (!event.deliverables) return total;
                      return total + event.deliverables.filter(d => d.status === 'revision-requested').length;
                    }, 0)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-4">Recent Deliveries</h3>
              <div className="space-y-4">
                {postProductionEvents
                  .filter(event => event.deliverables && event.deliverables.some(
                    d => d.status === 'delivered' || d.status === 'completed'
                  ))
                  .flatMap(event => {
                    if (!event.deliverables) return [];
                    return event.deliverables
                      .filter(d => d.status === 'delivered' || d.status === 'completed')
                      .map((deliverable, i) => ({
                        eventName: event.name,
                        clientName: event.clientName,
                        deliverable,
                        key: `${event.id}-${i}`
                      }));
                  })
                  .slice(0, 3)
                  .map((item) => (
                    <div key={item.key} className="space-y-2 pb-2 border-b last:border-b-0">
                      <p className="font-medium text-sm">{item.eventName}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Film className="h-3 w-3" />
                        <span className="capitalize">{item.deliverable.type} - {item.deliverable.status}</span>
                      </div>
                    </div>
                  ))}
                
                {!postProductionEvents.some(event => 
                  event.deliverables && event.deliverables.some(
                    d => d.status === 'delivered' || d.status === 'completed'
                  )
                ) && (
                  <p className="text-sm text-muted-foreground">No recent deliveries</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
