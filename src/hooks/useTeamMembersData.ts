
import { useTeamMembersLoader } from "./team/useTeamMembersLoader";
import { useTeamMembersPersistence } from "./team/useTeamMembersPersistence";
import { useTeamMembersOperations } from "./team/useTeamMembersOperations";

export function useTeamMembersData() {
  // Use the team members loader hook
  const { teamMembers, setTeamMembers } = useTeamMembersLoader();
  
  // Use the team members persistence hook
  useTeamMembersPersistence(teamMembers);
  
  // Use the team members operations hook
  const { 
    handleAddTeamMember,
    handleUpdateTeamMember,
    handleDeleteTeamMember
  } = useTeamMembersOperations(teamMembers, setTeamMembers);

  return {
    teamMembers,
    handleAddTeamMember,
    handleUpdateTeamMember,
    handleDeleteTeamMember
  };
}

// Re-export the mock data for other components that might need it
export { mockTeamMembers } from "./team/useTeamMembersLoader";
