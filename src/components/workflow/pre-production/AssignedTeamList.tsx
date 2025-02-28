
import { Card } from "@/components/ui/card";

interface AssignedTeamListProps {
  assignedTeamMembers: Array<{ 
    teamMember?: { 
      name: string; 
      role: string;
      isFreelancer?: boolean;
    }; 
    status: string;
  }>;
}

export function AssignedTeamList({ assignedTeamMembers }: AssignedTeamListProps) {
  return (
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
  );
}
