
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TeamMember } from "@/components/scheduling/types";
import { useTeamManagement } from "@/hooks/useTeamManagement";
import { TeamMemberCard } from "./TeamMemberCard";
import { AddTeamMemberDialog } from "./AddTeamMemberDialog";

interface TeamManagementProps {
  teamMembers: TeamMember[];
  onAddTeamMember: (member: TeamMember) => void;
  onUpdateTeamMember: (member: TeamMember) => void;
  onDeleteTeamMember: (id: string) => void;
}

export function TeamManagement({
  teamMembers,
  onAddTeamMember,
  onUpdateTeamMember,
  onDeleteTeamMember,
}: TeamManagementProps) {
  const {
    showAddDialog,
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    formData,
    setFormData,
    roles,
    handleAddMember,
    handleEditMember,
    handleDeleteMember,
    startEditMember,
  } = useTeamManagement(teamMembers, onAddTeamMember, onUpdateTeamMember, onDeleteTeamMember);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Team Members</h3>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teamMembers.map((member) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            onEdit={startEditMember}
            onDelete={handleDeleteMember}
          />
        ))}
      </div>

      {/* Add Member Dialog */}
      <AddTeamMemberDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddMember}
        roles={roles}
        title="Add Team Member"
        submitLabel="Add Member"
      />

      {/* Edit Member Dialog */}
      <AddTeamMemberDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleEditMember}
        roles={roles}
        title="Edit Team Member"
        submitLabel="Save Changes"
      />
    </div>
  );
}
