
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TeamMember } from '@/components/settings/types';

export function useTeamMembersData() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTeamMembers = useCallback(async () => {
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
  }, [toast]);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  // Function to convert the team members to a format compatible with existing app
  // This is for backward compatibility
  const getCompatibleTeamMembers = useCallback(() => {
    return teamMembers.map(member => ({
      id: member.id || '',
      name: member.name,
      role: member.role,
      email: member.email || '',
      phone: member.phone || '',
      whatsapp: member.whatsapp || member.phone || '',
      isFreelancer: member.is_freelancer || false,
      availability: member.availability || {},
    }));
  }, [teamMembers]);

  return {
    teamMembers: getCompatibleTeamMembers(),
    rawTeamMembers: teamMembers,
    loading,
    refetch: fetchTeamMembers
  };
}
