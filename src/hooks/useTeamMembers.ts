
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TeamMember } from '@/components/settings/types';

export function useTeamMembers() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('name');

      if (error) throw error;
      setTeamMembers(data as TeamMember[]);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast({
        title: 'Error',
        description: 'Failed to load team members',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addTeamMember = async (teamMember: TeamMember) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('team_members')
        .insert(teamMember);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Team member added successfully',
      });
      
      fetchTeamMembers();
    } catch (error) {
      console.error('Error adding team member:', error);
      toast({
        title: 'Error',
        description: 'Failed to add team member',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTeamMember = async (teamMember: TeamMember) => {
    if (!teamMember.id) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('team_members')
        .update(teamMember)
        .eq('id', teamMember.id);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Team member updated successfully',
      });
      
      fetchTeamMembers();
    } catch (error) {
      console.error('Error updating team member:', error);
      toast({
        title: 'Error',
        description: 'Failed to update team member',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Team member deleted successfully',
      });
      
      fetchTeamMembers();
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete team member',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    teamMembers,
    loading,
    fetchTeamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
  };
}
