import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFreelancers } from "./api/freelancerApi";
import { fetchJobs, addJob, updateJob, deleteJob } from "./api/jobApi";
import { Freelancer, Job, JobFormData } from "@/types/hire";
import { useToast } from "@/hooks/use-toast";

export function useHireData() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showPostJob, setShowPostJob] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isEditJobModalOpen, setIsEditJobModalOpen] = useState(false);
  const [isDeleteJobConfirmOpen, setIsDeleteJobConfirmOpen] = useState(false);

  // Fetch freelancers
  const { 
    data: freelancers = [], 
    isLoading: isLoadingFreelancers 
  } = useQuery({
    queryKey: ['freelancers'],
    queryFn: fetchFreelancers,
    onError: (error: any) => {
      console.error("Error fetching freelancers:", error);
      toast({
        title: "Error",
        description: "Failed to load freelancers",
        variant: "destructive"
      });
    }
  });

  // Fetch jobs
  const { 
    data: jobs = [], 
    isLoading: isLoadingJobs 
  } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    onError: (error: any) => {
      console.error("Error fetching jobs:", error);
      toast({
        title: "Error",
        description: "Failed to load job postings",
        variant: "destructive"
      });
    }
  });

  // Add job mutation
  const addJobMutation = useMutation({
    mutationFn: (jobData: JobFormData) => addJob(jobData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: "Job Posted",
        description: "Your job has been posted successfully"
      });
      setShowPostJob(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to post job",
        variant: "destructive"
      });
    }
  });

  // Update job mutation
  const updateJobMutation = useMutation({
    mutationFn: ({ id, jobData }: { id: string; jobData: JobFormData }) => 
      updateJob(id, jobData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: "Job Updated",
        description: "Your job posting has been updated successfully"
      });
      setIsEditJobModalOpen(false);
      setSelectedJob(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update job posting",
        variant: "destructive"
      });
    }
  });

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: (id: string) => deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: "Job Deleted",
        description: "Your job posting has been deleted successfully"
      });
      setIsDeleteJobConfirmOpen(false);
      setSelectedJob(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to delete job posting",
        variant: "destructive"
      });
    }
  });

  // Filter freelancers based on search term and category
  const filteredFreelancers = freelancers.filter(freelancer => {
    const matchesSearch = 
      freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "all" || 
      freelancer.specialties.some(s => s.toLowerCase().includes(selectedCategory.toLowerCase()));
    
    return matchesSearch && matchesCategory;
  });

  // Handle posting a new job
  const handlePostJob = (jobData: JobFormData) => {
    addJobMutation.mutate(jobData);
  };

  // Handle updating a job
  const handleUpdateJob = (jobData: JobFormData) => {
    if (!selectedJob) return;
    updateJobMutation.mutate({ id: selectedJob.id, jobData });
  };

  // Handle deleting a job
  const handleDeleteJob = () => {
    if (!selectedJob) return;
    deleteJobMutation.mutate(selectedJob.id);
  };

  // Open edit modal for a job
  const handleEditJob = (job: Job) => {
    setSelectedJob(job);
    setIsEditJobModalOpen(true);
  };

  // Open delete confirmation for a job
  const handleConfirmDeleteJob = (job: Job) => {
    setSelectedJob(job);
    setIsDeleteJobConfirmOpen(true);
  };

  return {
    freelancers: filteredFreelancers,
    jobs,
    isLoadingFreelancers,
    isLoadingJobs,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    showPostJob,
    setShowPostJob,
    selectedJob,
    isEditJobModalOpen,
    isDeleteJobConfirmOpen,
    setIsEditJobModalOpen,
    setIsDeleteJobConfirmOpen,
    handlePostJob,
    handleUpdateJob,
    handleDeleteJob,
    handleEditJob,
    handleConfirmDeleteJob
  };
}