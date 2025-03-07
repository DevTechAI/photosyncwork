
import { useState, useEffect } from "react";
import { TeamMember } from "@/components/scheduling/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

// Empty array for mock data
export const mockTeamMembers: TeamMember[] = [];

export function useTeamMembersLoader() {
  // Team members data
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const { toast } = useToast();
  
  // Load team members from Supabase on component mount
  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*');
        
        if (error) {
          console.error('Error loading team members from Supabase:', error);
          toast({
            title: "Error Loading Team Members",
            description: "Could not load team members from the database.",
            variant: "destructive"
          });
          setTeamMembers([]);
          return;
        }
        
        if (data && data.length > 0) {
          // Convert availability to correct format if needed
          const processedTeamMembers = data.map(member => ({
            id: member.id,
            name: member.name,
            role: member.role,
            email: member.email || "",
            phone: member.phone || "",
            whatsapp: member.whatsapp,
            availability: typeof member.availability === 'string' 
              ? JSON.parse(member.availability)
              : member.availability || {},
            isFreelancer: member.is_freelancer
          })) as TeamMember[];
          
          setTeamMembers(processedTeamMembers);
        } else {
          console.log("No team members found in Supabase");
          setTeamMembers([]);
        }
      } catch (error) {
        console.error('Error in loadTeamMembers:', error);
        toast({
          title: "Error Loading Team Members",
          description: "An unexpected error occurred.",
          variant: "destructive"
        });
        setTeamMembers([]);
      }
    };
    
    loadTeamMembers();
  }, [toast]);

  return {
    teamMembers,
    setTeamMembers
  };
}
