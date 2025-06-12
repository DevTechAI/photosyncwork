
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
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

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Fetch user profile using raw SQL to avoid typing issues
          setTimeout(async () => {
            try {
              const { data: profileData, error } = await supabase
                .rpc('get_user_profile', { user_id: session.user.id });

              if (error) {
                console.error('Error fetching profile:', error);
                // If profile doesn't exist, create one
                await createUserProfile(session.user);
              } else if (profileData && profileData.length > 0) {
                setProfile(profileData[0]);
              }
            } catch (error) {
              console.error('Error in profile fetch:', error);
              // Fallback: create a basic profile
              await createUserProfile(session.user);
            }
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch profile for existing session
        setTimeout(async () => {
          try {
            const { data: profileData, error } = await supabase
              .rpc('get_user_profile', { user_id: session.user.id });

            if (error) {
              console.error('Error fetching profile:', error);
              await createUserProfile(session.user);
            } else if (profileData && profileData.length > 0) {
              setProfile(profileData[0]);
            }
          } catch (error) {
            console.error('Error in profile fetch:', error);
            await createUserProfile(session.user);
          }
          setLoading(false);
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const createUserProfile = async (user: User) => {
    try {
      const profileData = {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        avatar_url: user.user_metadata?.avatar_url,
        storage_used: 0,
        storage_limit: 5368709120, // 5GB in bytes
        plan_type: 'pilot',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Use raw SQL to insert profile
      const { error } = await supabase.rpc('create_user_profile', {
        profile_data: profileData
      });

      if (error) {
        console.error('Error creating profile:', error);
      } else {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error in createUserProfile:', error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });
      
      if (error) {
        console.error('Google sign in error:', error);
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast({
        title: "Sign in failed",
        description: "Failed to sign in with Google",
        variant: "destructive"
      });
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
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

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return;

    try {
      const updatedProfile = { ...profile, ...updates, updated_at: new Date().toISOString() };
      
      const { error } = await supabase.rpc('update_user_profile', {
        profile_id: user.id,
        updates: updates
      });

      if (error) throw error;
      
      setProfile(updatedProfile);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signInWithGoogle,
    signOut,
    updateProfile
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
