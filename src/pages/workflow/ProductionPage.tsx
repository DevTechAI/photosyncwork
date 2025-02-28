
import Layout from "@/components/Layout";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { TimeTrackingTab } from "@/components/workflow/production/TimeTrackingTab";
import { ProductionNotesTab } from "@/components/workflow/production/ProductionNotesTab";
import { ProductionSidebar } from "@/components/workflow/production/ProductionSidebar";
import { mockEvents, mockTeamMembers } from "@/components/workflow/production/mockData";

export default function ProductionPage() {
  const [events, setEvents] = useState<ScheduledEvent[]>(mockEvents);
  const [teamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [activeTab, setActiveTab] = useState("tracking");
  
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
              <TabsContent value="tracking">
                <TimeTrackingTab 
                  events={events} 
                  teamMembers={teamMembers} 
                  onLogTime={handleLogTime} 
                />
              </TabsContent>
              
              {/* Production Notes Tab */}
              <TabsContent value="notes">
                <ProductionNotesTab events={events} />
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <ProductionSidebar events={events} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
