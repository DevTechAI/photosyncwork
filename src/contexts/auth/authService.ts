import { supabase } from "@/integrations/supabase/client";

export const authService = {
  signInWithEmail: async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Email sign in error:', error);
        return { error };
      }
      
      console.log('Sign in successful:', data.user?.email);
      return { error: null };
    } catch (error: any) {
      console.error('Email sign in error:', error);
      return { error };
    }
  },

  signUpWithEmail: async (email: string, password: string, fullName?: string) => {
    try {
      console.log('Attempting sign up for:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: {
            full_name: fullName || email.split('@')[0],
          }
        }
      });
      
      if (error) {
        console.error('Email sign up error:', error);
        return { error };
      }
      
      console.log('Sign up successful:', data.user?.email);
      return { error: null };
    } catch (error: any) {
      console.error('Email sign up error:', error);
      return { error };
    }
  },

  signInWithGoogle: async () => {
    try {
      console.log('Attempting Google sign in');
      
      // Use the current origin for the redirect URL
      const redirectTo = `${window.location.origin}/auth`;
      console.log('Using redirect URL:', redirectTo);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline' // Request a refresh token
          }
        }
      });
      
      if (error) {
        console.error('Google sign in error:', error);
        return { error };
      }
      
      console.log('Google sign in initiated successfully:', data);
      return { error: null };
    } catch (error: any) {
      console.error('Google sign in error:', error);
      return { error };
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
      return { error };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { error };
    }
  }
};