
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { TeamManagement } from "@/components/team/TeamManagement";
import { SchedulingOverview } from "./SchedulingOverview";
import { PreProductionTab } from "./PreProductionTab";
import { ProductionTab } from "./ProductionTab";
import { PostProductionTab } from "./PostProductionTab";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";

interface SchedulingTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  events: ScheduledEvent[];
  teamMembers: TeamMember[];
  getEventsByStage: (stage: "pre-production" | "production" | "post-production" | "completed") => ScheduledEvent[];
  onAssignTeamMember: (eventId: string, teamMemberId: string, role: string) => void;
  onUpdateAssignmentStatus: (eventId: string, teamMemberId: string, status: "accepted" | "declined") => void;
  getAssignmentCounts: (event: ScheduledEvent) => {
    acceptedPhotographers: number;
    acceptedVideographers: number;
    pendingPhotographers: number;
    pendingVideographers: number;
    totalPhotographers: number;
    totalVideographers: number;
  };
  onUpdateTeamMember: (updatedMember: TeamMember) => void;
  onAddTeamMember: (member: TeamMember) => void;
  onDeleteTeamMember: (id: string) => void;
  showCreateEventButton?: boolean;
  onCreateEvent?: () => void;
  customTabs?: string[];
}

export function SchedulingTabs({
  activeTab,
  onTabChange,
  events,
  teamMembers,
  getEventsByStage,
  onAssignTeamMember,
  onUpdateAssignmentStatus,
  getAssignmentCounts,
  onUpdateTeamMember,
  onAddTeamMember,
  onDeleteTeamMember,
  showCreateEventButton = true,
  onCreateEvent,
  customTabs
}: SchedulingTabsProps) {
  // Define which tabs should be shown
  const showOverviewTab = !customTabs || customTabs.includes("overview");
  const showPreProductionTab = !customTabs || customTabs.includes("pre-production");
  const showProductionTab = !customTabs || customTabs.includes("production");
  const showPostProductionTab = !customTabs || customTabs.includes("post-production");
  const showTeamTab = !customTabs || customTabs.includes("team");

  // State to track mobile viewport
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if viewport is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  return (
    <div className="space-y-4">
      {showCreateEventButton && onCreateEvent && (
        <div className="flex justify-end">
          <Button onClick={onCreateEvent} className="mb-4">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className={`w-full ${isMobile ? 'flex-wrap' : 'justify-start'} mb-4`}>
          {showOverviewTab && <TabsTrigger value="overview" className={isMobile ? "flex-grow" : ""}>Overview</TabsTrigger>}
          {showPreProductionTab && <TabsTrigger value="pre-production" className={isMobile ? "flex-grow" : ""}>Pre-Production</TabsTrigger>}
          {showProductionTab && <TabsTrigger value="production" className={isMobile ? "flex-grow" : ""}>Production</TabsTrigger>}
          {showPostProductionTab && <TabsTrigger value="post-production" className={isMobile ? "flex-grow" : ""}>Post-Production</TabsTrigger>}
          {showTeamTab && <TabsTrigger value="team" className={isMobile ? "flex-grow" : ""}>Team</TabsTrigger>}
        </TabsList>
        
        {/* Overview Tab */}
        {showOverviewTab && (
          <TabsContent value="overview" className="space-y-4">
            <SchedulingOverview 
              events={events} 
              getEventsByStage={getEventsByStage} 
            />
          </TabsContent>
        )}
        
        {/* Pre-Production Tab */}
        {showPreProductionTab && (
          <TabsContent value="pre-production">
            <PreProductionTab 
              events={getEventsByStage("pre-production")}
              teamMembers={teamMembers}
              onAssignTeamMember={onAssignTeamMember}
              onUpdateAssignmentStatus={onUpdateAssignmentStatus}
              getAssignmentCounts={getAssignmentCounts}
            />
          </TabsContent>
        )}
        
        {/* Production Tab */}
        {showProductionTab && (
          <TabsContent value="production">
            <ProductionTab 
              events={getEventsByStage("production")} 
              teamMembers={teamMembers} 
            />
          </TabsContent>
        )}
        
        {/* Post-Production Tab */}
        {showPostProductionTab && (
          <TabsContent value="post-production">
            <PostProductionTab 
              events={getEventsByStage("post-production")} 
              teamMembers={teamMembers} 
            />
          </TabsContent>
        )}
        
        {/* Team Tab */}
        {showTeamTab && (
          <TabsContent value="team">
            <TeamManagement 
              teamMembers={teamMembers} 
              onAddTeamMember={onAddTeamMember}
              onUpdateTeamMember={onUpdateTeamMember}
              onDeleteTeamMember={onDeleteTeamMember}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
