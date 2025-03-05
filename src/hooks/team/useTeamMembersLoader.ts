
import { useState, useEffect } from "react";
import { TeamMember } from "@/components/scheduling/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Mock data for demonstration - used as fallback if database fetch fails
export const mockTeamMembers: TeamMember[] = [
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
            description: "Could not load team members from the database. Using demo data.",
            variant: "destructive"
          });
          // Use mock data as fallback
          setTeamMembers(mockTeamMembers);
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
          console.log("No team members found in Supabase, initializing with mock data");
          // No data in Supabase, use mock data and save it
          setTeamMembers(mockTeamMembers);
          
          // Save mock data to Supabase
          for (const member of mockTeamMembers) {
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
            
            await supabase
              .from('team_members')
              .insert(dbMember);
          }
        }
      } catch (error) {
        console.error('Error in loadTeamMembers:', error);
        toast({
          title: "Error Loading Team Members",
          description: "An unexpected error occurred. Using demo data.",
          variant: "destructive"
        });
        setTeamMembers(mockTeamMembers);
      }
    };
    
    loadTeamMembers();
  }, [toast]);

  return {
    teamMembers,
    setTeamMembers
  };
}
