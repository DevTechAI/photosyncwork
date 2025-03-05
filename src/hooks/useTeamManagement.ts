
import { useState } from "react";
import { TeamMember, TeamMemberRole } from "@/components/scheduling/types";
import { useToast } from "@/components/ui/use-toast";

export function useTeamManagement(
  teamMembers: TeamMember[],
  onAddTeamMember: (member: TeamMember) => void,
  onUpdateTeamMember: (member: TeamMember) => void,
  onDeleteTeamMember: (id: string) => void
) {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: "",
    role: "photographer",
    email: "",
    phone: "",
    whatsapp: "",
  });

  const roles: TeamMemberRole[] = ["photographer", "videographer", "editor", "production"];

  const handleAddMember = () => {
    if (!formData.name || !formData.role || !formData.email || !formData.phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: formData.name || "",
      role: formData.role as TeamMemberRole || "photographer",
      email: formData.email || "",
      phone: formData.phone || "",
      whatsapp: formData.whatsapp || formData.phone || "",
      availability: {},
    };

    onAddTeamMember(newMember);
    setFormData({
      name: "",
      role: "photographer",
      email: "",
      phone: "",
      whatsapp: "",
    });
    setShowAddDialog(false);
    
    toast({
      title: "Team member added",
      description: `${newMember.name} has been added to your team`,
    });
  };

  const handleEditMember = () => {
    if (!currentMember) return;
    
    const updatedMember: TeamMember = {
      ...currentMember,
      name: formData.name || currentMember.name,
      role: formData.role as TeamMemberRole || currentMember.role,
      email: formData.email || currentMember.email,
      phone: formData.phone || currentMember.phone,
      whatsapp: formData.whatsapp || formData.phone || currentMember.whatsapp,
    };

    onUpdateTeamMember(updatedMember);
    setShowEditDialog(false);
    setCurrentMember(null);
    
    toast({
      title: "Team member updated",
      description: `${updatedMember.name}'s information has been updated`,
    });
  };

  const handleDeleteMember = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name} from your team?`)) {
      onDeleteTeamMember(id);
      
      toast({
        title: "Team member removed",
        description: `${name} has been removed from your team`,
      });
    }
  };

  const startEditMember = (member: TeamMember) => {
    setCurrentMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      email: member.email,
      phone: member.phone,
      whatsapp: member.whatsapp || member.phone,
    });
    setShowEditDialog(true);
  };

  return {
    showAddDialog,
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    currentMember,
    formData,
    setFormData,
    roles,
    handleAddMember,
    handleEditMember,
    handleDeleteMember,
    startEditMember,
  };
}
