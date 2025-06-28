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
  const [bypassAuth, setBypassAuth] = useState(false); // Add bypass state
  const { toast } = useToast();
  
  const { profile, fetchUserProfile, updateProfile, clearProfile } = useProfileManager();

  // Check for bypass in localStorage
  useEffect(() => {
    const savedBypass = localStorage.getItem('bypassAuth');
    if (savedBypass === 'true') {
      console.log('Auth bypass enabled from localStorage');
      setBypassAuth(true);
      
      // Create a mock user for bypass mode
      const mockUser = {
        id: 'bypass-user-id',
        email: 'bypass@example.com',
        user_metadata: {
          full_name: 'Bypass User'
        }
      } as User;
      
      setUser(mockUser);
      
      // Create a mock profile
      const mockProfile = {
        id: 'bypass-user-id',
        email: 'bypass@example.com',
        full_name: 'Bypass User',
        avatar_url: null,
        storage_used: 0,
        storage_limit: 5368709120, // 5GB
        plan_type: 'pilot',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setProfile(mockProfile);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    // Skip Supabase auth if bypass is enabled
    if (bypassAuth) return;
    
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
  }, [fetchUserProfile, clearProfile, bypassAuth]);

  const signOut = async () => {
    try {
      // If using bypass, just clear the bypass
      if (bypassAuth) {
        setBypassAuth(false);
        setUser(null);
        setProfile(null);
        localStorage.removeItem('bypassAuth');
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

  const handleUpdateProfile = async (updates: Partial<typeof profile>) => {
    await updateProfile(user, updates);
  };
  
  // Add function to toggle bypass auth
  const toggleBypassAuth = (role: string = 'manager') => {
    const newBypassState = !bypassAuth;
    setBypassAuth(newBypassState);
    localStorage.setItem('bypassAuth', newBypassState.toString());
    
    if (newBypassState) {
      // Create a mock user for bypass mode
      const mockUser = {
        id: 'bypass-user-id',
        email: `${role}@example.com`,
        user_metadata: {
          full_name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`
        }
      } as User;
      
      setUser(mockUser);
      
      // Create a mock profile
      const mockProfile = {
        id: 'bypass-user-id',
        email: `${role}@example.com`,
        full_name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
        avatar_url: null,
        storage_used: 0,
        storage_limit: 5368709120, // 5GB
        plan_type: 'pilot',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setProfile(mockProfile);
      
      toast({
        title: "Bypass Mode Enabled",
        description: `You are now in bypass mode as ${role}`
      });
    } else {
      setUser(null);
      setProfile(null);
      toast({
        title: "Bypass Mode Disabled",
        description: "Authentication bypass has been turned off"
      });
    }
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
    updateProfile: handleUpdateProfile,
    bypassAuth, // Expose bypass state
    toggleBypassAuth // Expose toggle function
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