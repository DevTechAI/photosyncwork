import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { firestore } from "@/integrations/google/firebaseConfig";
import { Freelancer } from "@/types/hire";

/**
 * Fetch all freelancers from Firestore
 */
export const fetchFreelancers = async (): Promise<Freelancer[]> => {
  try {
    const freelancersRef = collection(firestore, "freelancers");
    const q = query(freelancersRef, orderBy("name"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Freelancer[];
  } catch (error) {
    console.error("Error fetching freelancers:", error);
    return [];
  }
};

/**
 * Add a new freelancer to Firestore
 */
export const addFreelancer = async (freelancer: Omit<Freelancer, 'id' | 'created_at' | 'updated_at'>): Promise<Freelancer> => {
  try {
    const freelancersRef = collection(firestore, "freelancers");
    
    const freelancerData = {
      ...freelancer,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const docRef = await addDoc(freelancersRef, freelancerData);
    
    return {
      id: docRef.id,
      ...freelancerData
    } as Freelancer;
  } catch (error) {
    console.error("Error adding freelancer:", error);
    throw error;
  }
};

/**
 * Update an existing freelancer in Firestore
 */
export const updateFreelancer = async (freelancer: Freelancer): Promise<Freelancer> => {
  try {
    const { id, created_at, ...updateData } = freelancer;
    
    const freelancerRef = doc(firestore, "freelancers", id);
    
    await updateDoc(freelancerRef, {
      ...updateData,
      updated_at: new Date().toISOString()
    });
    
    // Get the updated document
    const docSnap = await getDoc(freelancerRef);
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Freelancer;
  } catch (error) {
    console.error("Error updating freelancer:", error);
    throw error;
  }
};

/**
 * Delete a freelancer from Firestore
 */
export const deleteFreelancer = async (id: string): Promise<void> => {
  try {
    const freelancerRef = doc(firestore, "freelancers", id);
    await deleteDoc(freelancerRef);
  } catch (error) {
    console.error("Error deleting freelancer:", error);
    throw error;
  }
};

/**
 * Fetch a single freelancer by ID from Firestore
 */
export const fetchFreelancerById = async (id: string): Promise<Freelancer | null> => {
  try {
    const freelancerRef = doc(firestore, "freelancers", id);
    const docSnap = await getDoc(freelancerRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Freelancer;
  } catch (error) {
    console.error("Error fetching freelancer by ID:", error);
    return null;
  }
};