import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@/integrations/google/firebaseConfig";
import { signInWithGoogle, signOutUser, onAuthStateChange, handleGoogleRedirectResult } from "@/integrations/google/authClient";
import { useToast } from "@/hooks/use-toast";
import { useBypassAuth } from "./BypassAuthContext";
import { supabase } from "@/integrations/supabase/client";

// Define profile type
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  storage_used: number;
  storage_limit: number;
  plan_type: string;
  primary_role?: string;
  created_at: string;
  updated_at: string;
}

// Define context type
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  bypassAuth: boolean;
  toggleBypassAuth: (role?: string) => void;
  userRoles: string[];
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mockProfile, setMockProfile] = useState<Profile | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const { toast } = useToast();
  const { bypassEnabled, mockUser, mockProfile: bypassMockProfile, toggleBypass, setMockRole } = useBypassAuth();

  // Use bypass auth if enabled
  useEffect(() => {
    if (bypassEnabled) {
      setUser(mockUser);
      setMockProfile(bypassMockProfile);
      setLoading(false);
    }
  }, [bypassEnabled, mockUser, bypassMockProfile]);

  // Listen for auth state changes
  useEffect(() => {
    // Skip if bypass is enabled
    if (bypassEnabled) return;
    
    setLoading(true);
    
    // Check for redirect result on page load
    const checkRedirectResult = async () => {
      try {
        await handleGoogleRedirectResult();
      } catch (error) {
        console.error("Error handling redirect result:", error);
        toast({
          title: "Sign in failed",
          description: "Failed to complete Google sign-in",
          variant: "destructive"
        });
      }
    };
    
    checkRedirectResult();
    
    const unsubscribe = onAuthStateChange(async (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        try {
          // Fetch or create user profile
          const userProfile = await fetchUserProfile(authUser);
          setProfile(userProfile);
          
          // Load user roles and permissions
          await loadUserRolesAndPermissions(authUser.uid);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setProfile(null);
        setUserRoles([]);
        setUserPermissions([]);
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [bypassEnabled]);

  // Load user roles and permissions from Supabase
  const loadUserRolesAndPermissions = async (userId: string) => {
    try {
      // Get user roles
      const { data: rolesData, error: rolesError } = await supabase
        .rpc('get_user_roles', { user_id: userId });

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        // Assign default role if no roles found
        await assignDefaultRole(userId);
        return;
      }

      // Get user permissions
      const { data: permissionsData, error: permissionsError } = await supabase
        .rpc('get_user_permissions', { user_id: userId });

      if (permissionsError) {
        console.error('Error fetching user permissions:', permissionsError);
        return;
      }

      const roles = (rolesData || []).map((role: any) => role.role_name);
      const permissions = (permissionsData || []).map((perm: any) => perm.permission_name);

      setUserRoles(roles);
      setUserPermissions(permissions);
    } catch (error) {
      console.error('Error loading RBAC data:', error);
    }
  };

  // Assign default role to new users
  const assignDefaultRole = async (userId: string) => {
    try {
      // Get default role (photographer)
      const { data: roleData } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'photographer')
        .single();

      if (roleData) {
        await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role_id: roleData.id,
            assigned_by: userId
          });

        // Reload roles
        await loadUserRolesAndPermissions(userId);
      }
    } catch (error) {
      console.error('Error assigning default role:', error);
    }
  };

  // Check if user has specific permission
  const hasPermission = (permission: string): boolean => {
    if (bypassEnabled) return true; // Bypass mode has all permissions
    return userPermissions.includes(permission);
  };

  // Check if user has specific role
  const hasRole = (role: string): boolean => {
    if (bypassEnabled) {
      // In bypass mode, check the mock role
      const mockRole = bypassMockProfile?.primary_role || 'manager';
      return role === mockRole;
    }
    return userRoles.includes(role);
  };

  // Fetch or create user profile
  const fetchUserProfile = async (user: User): Promise<Profile> => {
    const userRef = doc(firestore, "profiles", user.uid);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      // Profile exists, return it
      return docSnap.data() as Profile;
    } else {
      // Create new profile
      const newProfile: Profile = {
        id: user.uid,
        email: user.email || "",
        full_name: user.displayName || user.email?.split('@')[0] || "User",
        avatar_url: user.photoURL || undefined,
        storage_used: 0,
        storage_limit: 5368709120, // 5GB in bytes
        plan_type: "pilot",
        primary_role: "photographer",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Save new profile to Firestore
      await setDoc(userRef, newProfile);
      
      return newProfile;
    }
  };

  // Sign in with Google
  const handleSignInWithGoogle = async () => {
    try {
      // Set loading state to prevent multiple sign-in attempts
      setLoading(true);
      
      // Attempt to sign in with Google
      await signInWithGoogle();
      
      // Note: Success toast will be shown after redirect completes
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      toast({
        title: "Sign in failed",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive"
      });
      
      // Reset loading state on error
      setLoading(false);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      // If using bypass, just clear the bypass
      if (bypassEnabled) {
        toggleBypass();
        toast({
          title: "Signed out",
          description: "You have been signed out of bypass mode"
        });
        return;
      }
      
      // Otherwise use normal sign out
      await signOutUser();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully"
      });
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Sign out failed",
        description: error.message || "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  // Update profile
  const handleUpdateProfile = async (updates: Partial<Profile>) => {
    if (bypassEnabled) {
      // Update mock profile for bypass mode
      setMockProfile(prev => prev ? { ...prev, ...updates } : null);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated in bypass mode"
      });
      return;
    }
    
    if (!user || !profile) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const userRef = doc(firestore, "profiles", user.uid);
      
      // Update profile in Firestore
      await updateDoc(userRef, {
        ...updates,
        updated_at: new Date().toISOString()
      });
      
      // Update local state
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    }
  };
  
  // Add function to toggle bypass auth
  const toggleBypassAuth = (role: string = 'manager') => {
    setMockRole(role);
    toggleBypass();
  };

  // Context value
  const value = {
    user: bypassEnabled ? mockUser : user,
    profile: bypassEnabled ? bypassMockProfile || mockProfile : profile,
    loading: bypassEnabled ? false : loading,
    signInWithGoogle: handleSignInWithGoogle,
    signOut: handleSignOut,
    updateProfile: handleUpdateProfile,
    bypassAuth: bypassEnabled,
    toggleBypassAuth,
    userRoles: bypassEnabled ? [bypassMockProfile?.primary_role || 'manager'] : userRoles,
    hasPermission,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}