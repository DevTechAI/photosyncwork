import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { firestore } from "@/integrations/google/firebaseConfig";
import { Job, JobFormData } from "@/types/hire";

/**
 * Format the posted date to a relative time string
 */
const formatPostedDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} weeks ago`;
  } else {
    return `${Math.floor(diffDays / 30)} months ago`;
  }
};

/**
 * Fetch all job postings from Firestore
 */
export const fetchJobs = async (): Promise<Job[]> => {
  try {
    const jobsRef = collection(firestore, "job_postings");
    const q = query(jobsRef, orderBy("created_at", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      postedDate: formatPostedDate(doc.data().created_at)
    })) as Job[];
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};

/**
 * Add a new job posting to Firestore
 */
export const addJob = async (job: JobFormData): Promise<Job> => {
  try {
    const jobsRef = collection(firestore, "job_postings");
    
    const jobData = {
      ...job,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const docRef = await addDoc(jobsRef, jobData);
    
    return {
      id: docRef.id,
      ...jobData,
      postedDate: "Just now"
    } as Job;
  } catch (error) {
    console.error("Error adding job:", error);
    throw error;
  }
};

/**
 * Update an existing job posting in Firestore
 */
export const updateJob = async (id: string, job: JobFormData): Promise<Job> => {
  try {
    const jobRef = doc(firestore, "job_postings", id);
    
    const updateData = {
      ...job,
      updated_at: new Date().toISOString()
    };
    
    await updateDoc(jobRef, updateData);
    
    // Get the updated document
    const docSnap = await getDoc(jobRef);
    
    return {
      id: docSnap.id,
      ...docSnap.data(),
      postedDate: formatPostedDate(docSnap.data().created_at)
    } as Job;
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

/**
 * Delete a job posting from Firestore
 */
export const deleteJob = async (id: string): Promise<void> => {
  try {
    const jobRef = doc(firestore, "job_postings", id);
    await deleteDoc(jobRef);
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};