import { supabase } from "@/integrations/supabase/client";
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
 * Fetch all job postings from the database
 */
export const fetchJobs = async (): Promise<Job[]> => {
  try {
    const { data, error } = await supabase
      .from('job_postings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
    
    return data.map(job => ({
      ...job,
      postedDate: formatPostedDate(job.created_at)
    })) as Job[];
  } catch (error) {
    console.error("Error in fetchJobs:", error);
    return [];
  }
};

/**
 * Add a new job posting to the database
 */
export const addJob = async (job: JobFormData): Promise<Job> => {
  try {
    const { data, error } = await supabase
      .from('job_postings')
      .insert({
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        budget: job.budget,
        date: job.date,
        description: job.description,
        requirements: job.requirements
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error adding job:", error);
      throw error;
    }
    
    return {
      ...data,
      postedDate: formatPostedDate(data.created_at)
    } as Job;
  } catch (error) {
    console.error("Error in addJob:", error);
    throw error;
  }
};

/**
 * Update an existing job posting in the database
 */
export const updateJob = async (id: string, job: JobFormData): Promise<Job> => {
  try {
    const { data, error } = await supabase
      .from('job_postings')
      .update({
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        budget: job.budget,
        date: job.date,
        description: job.description,
        requirements: job.requirements,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating job:", error);
      throw error;
    }
    
    return {
      ...data,
      postedDate: formatPostedDate(data.created_at)
    } as Job;
  } catch (error) {
    console.error("Error in updateJob:", error);
    throw error;
  }
};

/**
 * Delete a job posting from the database
 */
export const deleteJob = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('job_postings')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting job:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteJob:", error);
    throw error;
  }
};