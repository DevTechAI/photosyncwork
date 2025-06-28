import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

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
  const { user, profile } = useAuth();
  
  // On mount, check for saved user in localStorage or use auth context
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else if (user) {
      // If we have a user from auth context, create a user object
      const role = user.user_metadata?.role || "manager";
      const newUser: User = {
        id: user.uid,
        name: profile?.full_name || user.email?.split('@')[0] || "User",
        email: user.email || "",
        role: role as UserRole
      };
      setCurrentUser(newUser);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
    }
    
    setLoading(false);
  }, [user, profile]);
  
  // Save user to localStorage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);
  
  // Login function - creates a user based on email
  const login = (email: string): boolean => {
    // Extract role from email if possible
    let role: UserRole = "manager"; // Default role
    
    if (email.includes("photographer")) {
      role = "photographer";
    } else if (email.includes("videographer")) {
      role = "videographer";
    } else if (email.includes("editor")) {
      role = "editor";
    } else if (email.includes("accounts")) {
      role = "accounts";
    } else if (email.includes("crm")) {
      role = "crm";
    }
    
    // Create user object
    const newUser: User = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email: email,
      role: role
    };
    
    setCurrentUser(newUser);
    return true;
  };
  
  // Logout function
  const logout = () => {
    setCurrentUser(null);
  };
  
  // Function to provide path to team management based on user role
  const getTeamManagementPath = (): string => {
    // Different paths based on user role could be implemented here
    // For now, we'll return the main team management paths
    return "/workflow"; // Team tab is available here
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