
import React, { createContext, useContext, useState, useEffect } from "react";

// Define user roles
export type UserRole = "manager" | "accounts" | "crm" | "photographer" | "videographer" | "editor";

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedTasks?: string[]; // IDs of assigned events/tasks
}

// Empty array for sample users
const sampleUsers: User[] = [];

// Define context type
interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (email: string) => boolean;
  logout: () => void;
  hasAccess: (module: string) => boolean;
  loading: boolean; // Added loading property
  getTeamManagementPath: () => string; // Added helper function for finding team management
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state
  
  // On mount, check for saved user in localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false); // Set loading to false after we've checked local storage
  }, []);
  
  // Save user to localStorage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);
  
  // Login function - finds user by email
  const login = (email: string): boolean => {
    // Since we've cleared sample users, this will always return false
    // You'll need to implement real authentication here
    return false;
  };
  
  // Logout function
  const logout = () => {
    setCurrentUser(null);
  };
  
  // Function to provide path to team management based on user role
  const getTeamManagementPath = (): string => {
    // Different paths based on user role could be implemented here
    // For now, we'll return the main team management paths
    return "/workflow/pre-production"; // Team tab is available here
  };
  
  // Function to check if user has access to a specific module
  const hasAccess = (module: string): boolean => {
    if (!currentUser) return false;
    
    // Manager has access to everything
    if (currentUser.role === "manager") return true;
    
    // Role-based access for other roles
    switch (currentUser.role) {
      case "accounts":
        return ["finances", "invoices"].includes(module);
      case "crm":
        return ["estimates", "pre-production", "production", "post-production"].includes(module);
      case "photographer":
      case "videographer":
        return ["production"].includes(module);
      case "editor":
        return ["post-production"].includes(module);
      default:
        return false;
    }
  };
  
  const value = {
    currentUser,
    setCurrentUser,
    login,
    logout,
    hasAccess,
    loading,
    getTeamManagementPath
  };
  
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Custom hook to use the context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
