
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Trash } from "lucide-react";
import { TeamMember } from "@/components/scheduling/types";

interface TeamMemberCardProps {
  member: TeamMember;
  onEdit: (member: TeamMember) => void;
  onDelete: (id: string, name: string) => void;
}

export function TeamMemberCard({ 
  member, 
  onEdit, 
  onDelete 
}: TeamMemberCardProps) {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{member.name}</h4>
          <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(member)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(member.id, member.name)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-4 space-y-1 text-sm">
        <p>Email: {member.email}</p>
        <p>Phone: {member.phone}</p>
        {member.whatsapp && member.whatsapp !== member.phone && (
          <p>WhatsApp: {member.whatsapp}</p>
        )}
      </div>
    </Card>
  );
}
