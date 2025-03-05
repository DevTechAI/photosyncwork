
import { TeamMember } from "@/components/scheduling/types";
import { Button } from "@/components/ui/button";
import { UserCheck } from "lucide-react";

interface TeamMemberListProps {
  title: string;
  members: TeamMember[];
  assignedCount: number;
  requiredCount: number;
  onAssign: (teamMemberId: string) => void;
  loading: boolean;
}

export function TeamMemberList({
  title,
  members,
  assignedCount,
  requiredCount,
  onAssign,
  loading
}: TeamMemberListProps) {
  console.log(`TeamMemberList ${title} - Members:`, members);
  
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">{title} ({assignedCount} / {requiredCount})</h3>
      {members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {members.map(member => (
            <div 
              key={member.id} 
              className="p-3 border rounded-md flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.phone}</p>
                {member.isFreelancer && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                    Freelancer
                  </span>
                )}
              </div>
              <Button 
                size="sm" 
                onClick={() => {
                  console.log(`Assigning team member: ${member.id} (${member.name})`);
                  onAssign(member.id);
                }}
                disabled={loading}
              >
                <UserCheck className="h-4 w-4 mr-1" />
                Assign
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No more available {title.toLowerCase()}</p>
      )}
    </div>
  );
}
