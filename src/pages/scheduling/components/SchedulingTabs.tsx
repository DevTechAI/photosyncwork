
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { TeamManagement } from "@/components/team/TeamManagement";
import { SchedulingOverview } from "./SchedulingOverview";
import { PreProductionTab } from "./PreProductionTab";
import { ProductionTab } from "./ProductionTab";
import { PostProductionTab } from "./PostProductionTab";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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
  onCreateEvent
}: SchedulingTabsProps) {
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
        <TabsList className="w-full justify-start mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pre-production">Pre-Production</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="post-production">Post-Production</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <SchedulingOverview 
            events={events} 
            getEventsByStage={getEventsByStage} 
          />
        </TabsContent>
        
        {/* Pre-Production Tab */}
        <TabsContent value="pre-production">
          <PreProductionTab 
            events={getEventsByStage("pre-production")}
            teamMembers={teamMembers}
            onAssignTeamMember={onAssignTeamMember}
            onUpdateAssignmentStatus={onUpdateAssignmentStatus}
            getAssignmentCounts={getAssignmentCounts}
          />
        </TabsContent>
        
        {/* Production Tab */}
        <TabsContent value="production">
          <ProductionTab 
            events={getEventsByStage("production")} 
            teamMembers={teamMembers} 
          />
        </TabsContent>
        
        {/* Post-Production Tab */}
        <TabsContent value="post-production">
          <PostProductionTab 
            events={getEventsByStage("post-production")} 
            teamMembers={teamMembers} 
          />
        </TabsContent>
        
        {/* Team Tab */}
        <TabsContent value="team">
          <TeamManagement 
            teamMembers={teamMembers} 
            onAddTeamMember={onAddTeamMember}
            onUpdateTeamMember={onUpdateTeamMember}
            onDeleteTeamMember={onDeleteTeamMember}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
