
import { useState, useEffect } from "react";
import { TeamMember } from "@/components/scheduling/types";
import { supabase } from "@/integrations/supabase/client";

// Mock data for demonstration - used as fallback if database fetch fails
const mockTeamMembers: TeamMember[] = [
  {
    id: "tm-1",
    name: "Ankit Patel",
    role: "photographer",
    email: "ankit@example.com",
    phone: "+91 98765 00001",
    whatsapp: "+91 98765 00001",
    availability: {
      "2023-05-20": "busy",
      "2023-05-21": "available",
      "2023-05-22": "available"
    }
  },
  {
    id: "tm-2",
    name: "Priya Singh",
    role: "videographer",
    email: "priya@example.com",
    phone: "+91 98765 00002",
    availability: {
      "2023-05-20": "busy",
      "2023-05-21": "busy",
      "2023-05-22": "available"
    }
  },
  {
    id: "tm-3",
    name: "Raj Kumar",
    role: "photographer",
    email: "raj@example.com",
    phone: "+91 98765 00003",
    availability: {
      "2023-05-20": "available",
      "2023-05-21": "available",
      "2023-05-22": "available"
    },
    isFreelancer: true
  }
];

export function useTeamMembersData() {
  // Team members data
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  
  // Load team members from Supabase on component mount
  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*');
        
        if (error) {
          console.error('Error loading team members from Supabase:', error);
          // Use mock data as fallback
          setTeamMembers(mockTeamMembers);
          return;
        }
        
        if (data && data.length > 0) {
          // Process the data to ensure proper types
          const processedTeamMembers = data.map(member => ({
            ...member,
            availability: typeof member.availability === 'string' 
              ? JSON.parse(member.availability)
              : member.availability || {}
          })) as TeamMember[];
          
          setTeamMembers(processedTeamMembers);
        } else {
          // No data in Supabase, use mock data and save it
          setTeamMembers(mockTeamMembers);
          
          // Save mock data to Supabase
          for (const member of mockTeamMembers) {
            await supabase
              .from('team_members')
              .insert(member);
          }
        }
      } catch (error) {
        console.error('Error in loadTeamMembers:', error);
        setTeamMembers(mockTeamMembers);
      }
    };
    
    loadTeamMembers();
  }, []);
  
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

  // Handle adding a team member
  const handleAddTeamMember = async (member: TeamMember) => {
    try {
      // Add to Supabase
      const { error } = await supabase
        .from('team_members')
        .insert(member);
      
      if (error) {
        console.error('Error adding team member to Supabase:', error);
        return;
      }
      
      // Update local state
      setTeamMembers(prev => [...prev, member]);
    } catch (error) {
      console.error('Error in handleAddTeamMember:', error);
    }
  };

  // Handle updating a team member
  const handleUpdateTeamMember = async (updatedMember: TeamMember) => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('team_members')
        .update(updatedMember)
        .eq('id', updatedMember.id);
      
      if (error) {
        console.error('Error updating team member in Supabase:', error);
        return;
      }
      
      // Update local state
      setTeamMembers(prev => 
        prev.map(m => m.id === updatedMember.id ? updatedMember : m)
      );
    } catch (error) {
      console.error('Error in handleUpdateTeamMember:', error);
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
        return;
      }
      
      // Update local state
      setTeamMembers(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error in handleDeleteTeamMember:', error);
    }
  };

  return {
    teamMembers,
    handleAddTeamMember,
    handleUpdateTeamMember,
    handleDeleteTeamMember
  };
}
