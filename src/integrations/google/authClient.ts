import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebaseConfig";

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Add scopes for additional permissions
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

// Set custom parameters
googleProvider.setCustomParameters({
  prompt: 'select_account',
  login_hint: 'user@example.com'
});

/**
 * Sign in with Google
 * @returns The user credentials
 */
export const signInWithGoogle = async () => {
  try {
    console.log("Starting Google sign-in process");
    
    // Force auth domain to be the one registered in Firebase
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      auth.config.authDomain = 'studiosync-e59aa.firebaseapp.com';
    }
    
    await signInWithRedirect(auth, googleProvider);
    console.log("Google sign-in redirect initiated");
    return null; // Redirect doesn't return immediately
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

/**
 * Handle redirect result after Google sign-in
 * @returns The user credentials or null if no redirect result
 */
export const handleGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      console.log("Google sign-in successful:", result.user.email);
      return result;
    }
    return null;
  } catch (error) {
    console.error("Error handling Google redirect result:", error);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

/**
 * Listen for auth state changes
 * @param callback The callback to call when the auth state changes
 * @returns The unsubscribe function
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Get the current user
 * @returns The current user or null if not signed in
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};