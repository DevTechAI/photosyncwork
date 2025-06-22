
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { TeamMember } from "@/components/scheduling/types";

interface RoleBasedAccessProps {
  teamMembers: TeamMember[];
  onRoleLogin: (member: TeamMember) => void;
}

export function RoleBasedAccess({ teamMembers, onRoleLogin }: RoleBasedAccessProps) {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedMember, setSelectedMember] = useState<string>("");
  const { toast } = useToast();

  const handleLogin = () => {
    if (!selectedMember) {
      toast({
        title: "Please select a team member",
        variant: "destructive"
      });
      return;
    }

    const member = teamMembers.find(m => m.id === selectedMember);
    if (member) {
      onRoleLogin(member);
      toast({
        title: `Logged in as ${member.name}`,
        description: `Role: ${member.role}`
      });
    }
  };

  const filteredMembers = selectedRole 
    ? teamMembers.filter(member => member.role === selectedRole)
    : teamMembers;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Team Member Access</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="role">Select Role</Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Choose your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Roles</SelectItem>
              <SelectItem value="photographer">Photographer</SelectItem>
              <SelectItem value="videographer">Videographer</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="member">Select Team Member</Label>
          <Select value={selectedMember} onValueChange={setSelectedMember}>
            <SelectTrigger>
              <SelectValue placeholder="Choose team member" />
            </SelectTrigger>
            <SelectContent>
              {filteredMembers.map(member => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name} - {member.role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleLogin} className="w-full">
          Access Dashboard
        </Button>

        <div className="text-sm text-muted-foreground mt-4">
          <p><strong>Role Access:</strong></p>
          <ul className="mt-2 space-y-1">
            <li>• <strong>Photographers/Videographers:</strong> View assignments, log time, upload files</li>
            <li>• <strong>Editors:</strong> Post-production deliverables, time tracking</li>
            <li>• <strong>Managers:</strong> Full workflow access, team assignments</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
