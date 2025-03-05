
import { useEffect } from "react";
import { TeamMember } from "@/components/scheduling/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useTeamMembersPersistence(teamMembers: TeamMember[]) {
  const { toast } = useToast();
  
  // Save teamMembers to Supabase whenever it changes
  useEffect(() => {
    if (teamMembers.length > 0) {
      const saveTeamMembers = async () => {
        try {
          // Update or insert each team member
          for (const member of teamMembers) {
            // Transform the member to match the database schema
            const dbMember = {
              id: member.id,
              name: member.name,
              role: member.role,
              email: member.email,
              phone: member.phone,
              whatsapp: member.whatsapp,
              availability: member.availability,
              is_freelancer: member.isFreelancer
            };
            
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
                .update(dbMember)
                .eq('id', member.id);
            } else {
              // Insert new member
              await supabase
                .from('team_members')
                .insert(dbMember);
            }
          }
        } catch (error) {
          console.error('Error saving team members to Supabase:', error);
          toast({
            title: "Error",
            description: "Failed to save team member data",
            variant: "destructive"
          });
        }
      };
      
      saveTeamMembers();
    }
  }, [teamMembers, toast]);
}
