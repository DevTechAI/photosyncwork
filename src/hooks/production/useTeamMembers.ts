
import { useState, useEffect } from "react";
import { TeamMember } from "@/components/scheduling/types";
import { supabase } from "@/integrations/supabase/client";

export function useTeamMembers() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Load team members from Supabase or localStorage
  useEffect(() => {
    const loadTeamMembers = async () => {
      setLoading(true);
      try {
        // Try to load from Supabase first
        const { data: teamMembersData, error } = await supabase
          .from('team_members')
          .select('*');
          
        if (error) {
          console.error("Error loading team members from Supabase:", error);
          throw error;
        }
        
        if (teamMembersData && teamMembersData.length > 0) {
          console.log("Loaded team members from Supabase:", teamMembersData);
          
          // Transform data if needed
          const transformedMembers = teamMembersData.map(member => ({
            ...member,
            availability: typeof member.availability === 'string' 
              ? JSON.parse(member.availability) 
              : member.availability || {}
          })) as TeamMember[];
          
          setTeamMembers(transformedMembers);
        } else {
          // Fallback to localStorage
          const savedTeamMembers = localStorage.getItem("teamMembers");
          if (savedTeamMembers) {
            setTeamMembers(JSON.parse(savedTeamMembers));
          }
        }
      } catch (error) {
        console.error("Error loading team members:", error);
        
        // Fallback to localStorage
        const savedTeamMembers = localStorage.getItem("teamMembers");
        if (savedTeamMembers) {
          setTeamMembers(JSON.parse(savedTeamMembers));
        }
      } finally {
        setLoading(false);
      }
    };

    loadTeamMembers();
  }, []);

  return {
    teamMembers,
    setTeamMembers,
    loading
  };
}
