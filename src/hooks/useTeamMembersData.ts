
import { useState, useEffect } from "react";
import { TeamMember } from "@/components/scheduling/types";

// Mock data for demonstration
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
  // Team members data - with persisted storage
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  
  // Load team members from localStorage on component mount
  useEffect(() => {
    try {
      const savedTeamMembers = localStorage.getItem('teamMembers');
      if (savedTeamMembers) {
        setTeamMembers(JSON.parse(savedTeamMembers));
      } else {
        // If no saved team members, use the mock data
        setTeamMembers(mockTeamMembers);
        // Save mock data to localStorage
        localStorage.setItem('teamMembers', JSON.stringify(mockTeamMembers));
      }
    } catch (error) {
      console.error('Error loading team members from localStorage:', error);
      setTeamMembers(mockTeamMembers);
    }
  }, []);
  
  // Save teamMembers to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
    } catch (error) {
      console.error('Error saving team members to localStorage:', error);
    }
  }, [teamMembers]);

  // Handle adding a team member
  const handleAddTeamMember = (member: TeamMember) => {
    setTeamMembers(prev => [...prev, member]);
  };

  // Handle updating a team member
  const handleUpdateTeamMember = (updatedMember: TeamMember) => {
    setTeamMembers(prev => 
      prev.map(m => m.id === updatedMember.id ? updatedMember : m)
    );
  };

  // Handle deleting a team member
  const handleDeleteTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  return {
    teamMembers,
    handleAddTeamMember,
    handleUpdateTeamMember,
    handleDeleteTeamMember
  };
}
