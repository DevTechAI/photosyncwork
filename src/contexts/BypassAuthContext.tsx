import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Profile } from "./auth/types";
import { v4 as uuidv4 } from "uuid";

// Define the context type
interface BypassAuthContextType {
  bypassEnabled: boolean;
  toggleBypass: () => void;
  mockUser: User | null;
  mockProfile: Profile | null;
  setMockRole: (role: string) => void;
  currentRole: string;
  availableRoles: string[];
}

// Create the context
const BypassAuthContext = createContext<BypassAuthContextType | undefined>(undefined);

// Create a mock user and profile
const createMockUser = (role: string): User => {
  const userId = uuidv4();
  return {
    id: userId,
    app_metadata: {},
    user_metadata: { role },
    aud: "authenticated",
    created_at: new Date().toISOString(),
    email: `${role}@example.com`,
    phone: "",
    role: "",
    updated_at: new Date().toISOString(),
  } as User;
};

const createMockProfile = (user: User): Profile => {
  return {
    id: user.id,
    email: user.email || "",
    full_name: user.email?.split('@')[0] || "Mock User",
    avatar_url: null,
    storage_used: 0,
    storage_limit: 5368709120, // 5GB
    plan_type: "pilot",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

// Provider component
export const BypassAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bypassEnabled, setBypassEnabled] = useState(() => {
    // Check if bypass was previously enabled
    return localStorage.getItem("bypassAuth") === "true";
  });
  
  const availableRoles = ["manager", "photographer", "videographer", "editor", "accounts", "crm"];
  const [currentRole, setCurrentRole] = useState(() => {
    // Get previously selected role or default to manager
    return localStorage.getItem("mockRole") || "manager";
  });
  
  const [mockUser, setMockUser] = useState<User | null>(null);
  const [mockProfile, setMockProfile] = useState<Profile | null>(null);

  // Update mock user and profile when role changes
  useEffect(() => {
    if (bypassEnabled) {
      const user = createMockUser(currentRole);
      setMockUser(user);
      setMockProfile(createMockProfile(user));
      localStorage.setItem("mockRole", currentRole);
    } else {
      setMockUser(null);
      setMockProfile(null);
    }
  }, [bypassEnabled, currentRole]);

  // Toggle bypass authentication
  const toggleBypass = () => {
    const newState = !bypassEnabled;
    setBypassEnabled(newState);
    localStorage.setItem("bypassAuth", newState.toString());
  };

  // Set mock role
  const setMockRole = (role: string) => {
    if (availableRoles.includes(role)) {
      setCurrentRole(role);
    }
  };

  // Context value
  const value = {
    bypassEnabled,
    toggleBypass,
    mockUser,
    mockProfile,
    setMockRole,
    currentRole,
    availableRoles,
  };

  return <BypassAuthContext.Provider value={value}>{children}</BypassAuthContext.Provider>;
};

// Hook to use the bypass auth context
export const useBypassAuth = () => {
  const context = useContext(BypassAuthContext);
  if (context === undefined) {
    throw new Error("useBypassAuth must be used within a BypassAuthProvider");
  }
  return context;
};