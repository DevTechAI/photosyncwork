
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

// Sample users for demonstration
const sampleUsers: User[] = [
  {
    id: "user-1",
    name: "Admin Manager",
    email: "admin@example.com",
    role: "manager"
  },
  {
    id: "user-2",
    name: "Finance Officer",
    email: "finance@example.com",
    role: "accounts"
  },
  {
    id: "user-3",
    name: "Client Relations",
    email: "crm@example.com",
    role: "crm"
  },
  {
    id: "user-4",
    name: "Ankit Patel",
    email: "ankit@example.com",
    role: "photographer",
    assignedTasks: ["evt-1"]
  },
  {
    id: "user-5",
    name: "Priya Singh",
    email: "priya@example.com",
    role: "videographer",
    assignedTasks: ["evt-2"]
  },
  {
    id: "user-6",
    name: "Vikram Desai",
    email: "vikram@example.com",
    role: "editor",
    assignedTasks: ["evt-3"]
  }
];

// Define context type
interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (email: string) => boolean;
  logout: () => void;
  hasAccess: (module: string) => boolean;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // On mount, check for saved user in localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
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
    const user = sampleUsers.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };
  
  // Logout function
  const logout = () => {
    setCurrentUser(null);
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
    hasAccess
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
