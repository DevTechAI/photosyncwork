
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthContextType } from "./auth/types";
import { authService } from "./auth/authService";
import { useProfileManager } from "./auth/useProfileManager";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const { profile, fetchUserProfile, updateProfile, clearProfile } = useProfileManager();

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    let isMounted = true;

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!isMounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in successfully');
          setTimeout(() => {
            if (isMounted) {
              fetchUserProfile(session.user.id);
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          clearProfile();
        }
        
        // Always set loading to false after processing auth state
        if (isMounted) {
          setLoading(false);
          console.log('Auth state processed, loading set to false');
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      
      console.log('Initial session check:', session?.user?.email || 'No session');
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          if (isMounted) {
            fetchUserProfile(session.user.id);
          }
        }, 0);
      }
      
      setLoading(false);
      console.log('Initial session check complete, setting loading to false');
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile, clearProfile]);

  const signOut = async () => {
    try {
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

  const handleUpdateProfile = async (updates: Partial<typeof profile>) => {
    await updateProfile(user, updates);
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signInWithEmail: authService.signInWithEmail,
    signUpWithEmail: authService.signUpWithEmail,
    signInWithGoogle: authService.signInWithGoogle,
    signOut,
    updateProfile: handleUpdateProfile
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
