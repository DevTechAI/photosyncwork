
import { useState, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "./types";
import { useToast } from "@/hooks/use-toast";

export const useProfileManager = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        await createUserProfile({ id: userId } as User);
      } else {
        console.log('Profile fetched successfully:', profileData);
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error in profile fetch:', error);
      await createUserProfile({ id: userId } as User);
    }
  }, []);

  const createUserProfile = useCallback(async (user: User) => {
    try {
      console.log('Creating profile for user:', user.id);
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

      const { error } = await supabase
        .from('profiles')
        .insert([profileData]);

      if (error) {
        console.error('Error creating profile:', error);
      } else {
        console.log('Profile created successfully');
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error in createUserProfile:', error);
    }
  }, []);

  const updateProfile = useCallback(async (user: User | null, updates: Partial<Profile>) => {
    if (!user || !profile) return;

    try {
      const updatedProfile = { ...profile, ...updates, updated_at: new Date().toISOString() };
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

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
  }, [profile, toast]);

  const clearProfile = useCallback(() => {
    setProfile(null);
  }, []);

  return {
    profile,
    fetchUserProfile,
    updateProfile,
    clearProfile
  };
};
