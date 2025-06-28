import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthContextType, Profile } from "./auth/types";
import { authService } from "./auth/authService";
import { useProfileManager } from "./auth/useProfileManager";
import { useBypassAuth } from "./BypassAuthContext";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [mockProfile, setMockProfile] = useState<Profile | null>(null);
  const { toast } = useToast();
  const { bypassEnabled, mockUser, mockProfile: bypassMockProfile, toggleBypass, setMockRole } = useBypassAuth();
  
  const { profile, fetchUserProfile, updateProfile, clearProfile } = useProfileManager();

  // Use bypass auth if enabled
  useEffect(() => {
    if (bypassEnabled) {
      setUser(mockUser);
      setMockProfile(bypassMockProfile);
      setLoading(false);
    }
  }, [bypassEnabled, mockUser, bypassMockProfile]);

  useEffect(() => {
    // Skip Supabase auth if bypass is enabled
    if (bypassEnabled) return;
    
    console.log('AuthProvider: Setting up auth state listener');
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log('Initial session check:', session?.user?.email || 'No session');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        if (mounted) {
          setLoading(false);
          console.log('Initial auth check complete, loading set to false');
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.email || 'No session');
        
        setSession(session);
        setUser(session?.user ?? null);

        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in successfully');
          fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          clearProfile();
        }
        
        if (mounted) {
          setLoading(false);
          console.log('Auth state processed, loading set to false');
        }
      }
    );

    // Initialize auth
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile, clearProfile, bypassEnabled]);

  const signOut = async () => {
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
      const { error } = await authService.signOut();
      if (error) {
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully"
        });
      }
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
  };

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
    
    await updateProfile(user, updates);
  };
  
  // Add function to toggle bypass auth
  const toggleBypassAuth = (role: string = 'manager') => {
    setMockRole(role);
    toggleBypass();
  };

  const value = {
    user: bypassEnabled ? mockUser : user,
    profile: bypassEnabled ? bypassMockProfile || mockProfile : profile,
    session,
    loading: bypassEnabled ? false : loading,
    signInWithEmail: authService.signInWithEmail,
    signUpWithEmail: authService.signUpWithEmail,
    signInWithGoogle: authService.signInWithGoogle,
    signOut,
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