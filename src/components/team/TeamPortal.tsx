
import { useState } from "react";
import { TeamMember } from "@/components/scheduling/types";
import { RoleBasedAccess } from "./RoleBasedAccess";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileImage, Users, LogOut } from "lucide-react";

interface TeamPortalProps {
  teamMembers: TeamMember[];
}

export function TeamPortal({ teamMembers }: TeamPortalProps) {
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(null);

  const handleRoleLogin = (member: TeamMember) => {
    setCurrentUser(member);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <RoleBasedAccess teamMembers={teamMembers} onRoleLogin={handleRoleLogin} />;
  }

  const getRoleFeatures = (role: string) => {
    switch (role) {
      case "photographer":
      case "videographer":
        return [
          { icon: Calendar, label: "View Assignments", href: "/pre-production" },
          { icon: Clock, label: "Log Time", href: "/production" },
          { icon: FileImage, label: "Upload Files", href: "/post-production" }
        ];
      case "editor":
        return [
          { icon: FileImage, label: "Deliverables", href: "/post-production" },
          { icon: Clock, label: "Time Tracking", href: "/production" },
          { icon: Calendar, label: "View Projects", href: "/pre-production" }
        ];
      case "manager":
        return [
          { icon: Users, label: "Team Management", href: "/pre-production" },
          { icon: Calendar, label: "Project Overview", href: "/production" },
          { icon: FileImage, label: "Final Review", href: "/post-production" }
        ];
      case "production":
        return [
          { icon: Calendar, label: "Production Schedule", href: "/production" },
          { icon: Clock, label: "Time Tracking", href: "/production" },
          { icon: Users, label: "Team Coordination", href: "/pre-production" }
        ];
      case "album_designer":
        return [
          { icon: FileImage, label: "Album Design", href: "/post-production" },
          { icon: Calendar, label: "Design Schedule", href: "/pre-production" },
          { icon: Clock, label: "Design Time", href: "/production" }
        ];
      default:
        return [
          { icon: Calendar, label: "View Schedule", href: "/scheduling" },
          { icon: Clock, label: "Time Tracking", href: "/production" }
        ];
    }
  };

  const features = getRoleFeatures(currentUser.role);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Welcome, {currentUser.name}</CardTitle>
              <Badge variant="secondary" className="mt-2">
                {currentUser.role}
              </Badge>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Access your role-specific features below
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <feature.icon className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-medium">{feature.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    Click to access
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-sm text-muted-foreground bg-muted p-4 rounded-md">
        <h4 className="font-medium mb-2">Your Role Permissions:</h4>
        <ul className="space-y-1">
          {currentUser.role === "photographer" || currentUser.role === "videographer" ? (
            <>
              <li>• View your event assignments and details</li>
              <li>• Log time spent on shoots</li>
              <li>• Upload photos/videos for post-production</li>
              <li>• Update assignment status (accepted/declined)</li>
            </>
          ) : currentUser.role === "editor" ? (
            <>
              <li>• Access post-production deliverables</li>
              <li>• Track editing time</li>
              <li>• Manage client delivery files</li>
              <li>• Handle revision requests</li>
            </>
          ) : currentUser.role === "manager" ? (
            <>
              <li>• Full access to all workflow stages</li>
              <li>• Assign team members to events</li>
              <li>• Monitor project progress</li>
              <li>• Review and approve deliverables</li>
            </>
          ) : currentUser.role === "production" ? (
            <>
              <li>• Coordinate production schedules</li>
              <li>• Manage on-site logistics</li>
              <li>• Track production progress</li>
              <li>• Communicate with team members</li>
            </>
          ) : currentUser.role === "album_designer" ? (
            <>
              <li>• Design and layout photo albums</li>
              <li>• Manage design timelines</li>
              <li>• Review client feedback on designs</li>
              <li>• Coordinate with editors for final assets</li>
            </>
          ) : (
            <>
              <li>• View assigned tasks</li>
              <li>• Log time and progress</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
