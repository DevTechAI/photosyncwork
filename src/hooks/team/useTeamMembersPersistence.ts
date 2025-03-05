
import { useEffect } from "react";
import { TeamMember } from "@/components/scheduling/types";
import { supabase } from "@/integrations/supabase/client";

export function useTeamMembersPersistence(teamMembers: TeamMember[]) {
  // Save teamMembers to Supabase whenever it changes
  useEffect(() => {
    if (teamMembers.length > 0) {
      const saveTeamMembers = async () => {
        try {
          // Update or insert each team member
          for (const member of teamMembers) {
            // Check if member already exists
            const { data: existingMember } = await supabase
              .from('team_members')
              .select('id')
              .eq('id', member.id)
              .maybeSingle();
            
            if (existingMember) {
              // Update existing member
              await supabase
                .from('team_members')
                .update(member)
                .eq('id', member.id);
            } else {
              // Insert new member
              await supabase
                .from('team_members')
                .insert(member);
            }
          }
        } catch (error) {
          console.error('Error saving team members to Supabase:', error);
        }
      };
      
      saveTeamMembers();
    }
  }, [teamMembers]);
}
