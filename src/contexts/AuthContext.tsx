import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@/integrations/google/firebaseConfig";
import { signInWithGoogle, signOutUser, onAuthStateChange } from "@/integrations/google/authClient";
import { useToast } from "@/hooks/use-toast";
import { useBypassAuth } from "./BypassAuthContext";

// Define profile type
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  storage_used: number;
  storage_limit: number;
  plan_type: string;
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
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mockProfile, setMockProfile] = useState<Profile | null>(null);
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
    
    const unsubscribe = onAuthStateChange(async (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        try {
          // Fetch or create user profile
          const userProfile = await fetchUserProfile(authUser);
          setProfile(userProfile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [bypassEnabled]);

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
      await signInWithGoogle();
      toast({
        title: "Signed in successfully",
        description: "Welcome to StudioSync!"
      });
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      toast({
        title: "Sign in failed",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive"
      });
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
    toggleBypassAuth
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