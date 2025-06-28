import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthContextType } from "./auth/types";
import { authService } from "./auth/authService";
import { useProfileManager } from "./auth/useProfileManager";
import { useBypassAuth } from "./BypassAuthContext";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const { profile, fetchUserProfile, updateProfile, clearProfile } = useProfileManager();
  const { bypassEnabled, mockUser, mockProfile } = useBypassAuth();

  useEffect(() => {
    // If bypass is enabled, use mock user and profile
    if (bypassEnabled) {
      console.log('AuthProvider: Using mock user and profile');
      setUser(mockUser);
      setLoading(false);
      return;
    }

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
  }, [fetchUserProfile, clearProfile, bypassEnabled, mockUser]);

  const signOut = useCallback(async () => {
    try {
      // If using bypass auth, just disable it
      if (bypassEnabled) {
        // This will be handled by the bypass context
        return { error: null };
      }

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
      return { error };
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: "Failed to sign out",
        variant: "destructive"
      });
      return { error };
    }
  }, [toast, bypassEnabled]);

  const handleUpdateProfile = useCallback(async (updates: Partial<typeof profile>) => {
    if (bypassEnabled) {
      // No-op for mock profile
      return;
    }
    await updateProfile(user, updates);
  }, [user, updateProfile, bypassEnabled]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user: bypassEnabled ? mockUser : user,
    profile: bypassEnabled ? mockProfile : profile,
    session,
    loading: bypassEnabled ? false : loading,
    signInWithEmail: authService.signInWithEmail,
    signUpWithEmail: authService.signUpWithEmail,
    signInWithGoogle: authService.signInWithGoogle,
    signOut,
    updateProfile: handleUpdateProfile
  }), [user, profile, session, loading, signOut, handleUpdateProfile, bypassEnabled, mockUser, mockProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}