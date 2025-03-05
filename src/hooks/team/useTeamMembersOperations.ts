
import { TeamMember } from "@/components/scheduling/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

export function useTeamMembersOperations(
  teamMembers: TeamMember[],
  setTeamMembers: (members: TeamMember[]) => void
) {
  const { toast } = useToast();

  // Handle adding a team member
  const handleAddTeamMember = async (member: TeamMember) => {
    try {
      // Generate a proper UUID for the team member
      const memberWithUuid = {
        ...member,
        id: uuidv4() // Generate a valid UUID
      };
      
      // Add to Supabase
      const { error } = await supabase
        .from('team_members')
        .insert({
          id: memberWithUuid.id,
          name: memberWithUuid.name,
          role: memberWithUuid.role,
          email: memberWithUuid.email,
          phone: memberWithUuid.phone,
          whatsapp: memberWithUuid.whatsapp,
          availability: memberWithUuid.availability || {},
          is_freelancer: memberWithUuid.isFreelancer || false
        });
      
      if (error) {
        console.error('Error adding team member to Supabase:', error);
        toast({
          title: "Error",
          description: "Failed to save team member. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      // Update local state
      setTeamMembers([...teamMembers, memberWithUuid]);
      
      toast({
        title: "Success",
        description: `${memberWithUuid.name} added to team successfully.`
      });
    } catch (error) {
      console.error('Error in handleAddTeamMember:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle updating a team member
  const handleUpdateTeamMember = async (updatedMember: TeamMember) => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('team_members')
        .update({
          name: updatedMember.name,
          role: updatedMember.role,
          email: updatedMember.email,
          phone: updatedMember.phone,
          whatsapp: updatedMember.whatsapp,
          availability: updatedMember.availability || {},
          is_freelancer: updatedMember.isFreelancer || false
        })
        .eq('id', updatedMember.id);
      
      if (error) {
        console.error('Error updating team member in Supabase:', error);
        toast({
          title: "Error",
          description: "Failed to update team member. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      // Update local state
      setTeamMembers(teamMembers.map(m => 
        m.id === updatedMember.id ? updatedMember : m
      ));
      
      toast({
        title: "Success",
        description: `${updatedMember.name}'s details updated successfully.`
      });
    } catch (error) {
      console.error('Error in handleUpdateTeamMember:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle deleting a team member
  const handleDeleteTeamMember = async (id: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting team member from Supabase:', error);
        toast({
          title: "Error",
          description: "Failed to delete team member. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      // Update local state
      setTeamMembers(teamMembers.filter(m => m.id !== id));
      
      toast({
        title: "Success",
        description: "Team member deleted successfully."
      });
    } catch (error) {
      console.error('Error in handleDeleteTeamMember:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    handleAddTeamMember,
    handleUpdateTeamMember,
    handleDeleteTeamMember
  };
}
