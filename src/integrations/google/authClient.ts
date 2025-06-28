import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebaseConfig";

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google
 * @returns The user credentials
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error("Error signing in with Google:", error);
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