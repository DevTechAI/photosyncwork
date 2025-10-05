import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchFreelancersWithPortfolio, 
  searchFreelancers, 
  fetchFreelancersBySpecialty,
  linkFreelancerPortfolio,
  getCurrentUserFreelancerProfile,
  toggleFreelancerEnlistStatus
} from "./api/freelancerApi";
import { fetchJobs, addJob, updateJob, deleteJob } from "./api/jobApi";
import { FreelancerWithPortfolio, Job, JobFormData } from "@/types/hire";
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
  const [selectedFreelancer, setSelectedFreelancer] = useState<FreelancerWithPortfolio | null>(null);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);

  // Fetch freelancers with portfolio data
  const { 
    data: freelancers = [], 
    isLoading: isLoadingFreelancers 
  } = useQuery({
    queryKey: ['freelancers-with-portfolio'],
    queryFn: fetchFreelancersWithPortfolio,
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

  // Fetch current user's freelancer profile
  const { 
    data: currentUserFreelancer, 
    isLoading: isLoadingCurrentUserFreelancer,
    refetch: refetchCurrentUserFreelancer
  } = useQuery({
    queryKey: ['current-user-freelancer'],
    queryFn: getCurrentUserFreelancerProfile,
    onError: (error: any) => {
      console.error("Error fetching current user freelancer:", error);
    }
  });

  // Filter freelancers based on search term and category
  const filteredFreelancers = freelancers.filter(freelancer => {
    const matchesSearch = !searchTerm || 
      freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.specialties?.some(specialty => 
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory = selectedCategory === "all" || 
      freelancer.specialties?.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  // Search freelancers mutation
  const searchFreelancersMutation = useMutation({
    mutationFn: ({ specialty, location }: { specialty?: string; location?: string }) =>
      searchFreelancers(specialty, location),
    onSuccess: (data) => {
      console.log("Search results:", data);
    },
    onError: (error: any) => {
      console.error("Error searching freelancers:", error);
      toast({
        title: "Search Error",
        description: "Failed to search freelancers",
        variant: "destructive"
      });
    }
  });

  // Link freelancer to portfolio mutation
  const linkPortfolioMutation = useMutation({
    mutationFn: ({ freelancerId, portfolioId }: { freelancerId: string; portfolioId: string }) =>
      linkFreelancerPortfolio(freelancerId, portfolioId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Portfolio linked successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['freelancers-with-portfolio'] });
    },
    onError: (error: any) => {
      console.error("Error linking portfolio:", error);
      toast({
        title: "Error",
        description: "Failed to link portfolio",
        variant: "destructive"
      });
    }
  });

  // Toggle freelancer enlist status mutation
  const toggleEnlistMutation = useMutation({
    mutationFn: toggleFreelancerEnlistStatus,
    onSuccess: (newStatus) => {
      const statusText = newStatus === 'enlisted' ? 'enlisted' : 'delisted';
      toast({
        title: "Success",
        description: `Profile ${statusText} successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ['current-user-freelancer'] });
      queryClient.invalidateQueries({ queryKey: ['freelancers-with-portfolio'] });
    },
    onError: (error: any) => {
      console.error("Error toggling enlist status:", error);
      toast({
        title: "Error",
        description: "Failed to update profile status",
        variant: "destructive"
      });
    }
  });

  // Add job mutation
  const addJobMutation = useMutation({
    mutationFn: addJob,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Job posted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setShowPostJob(false);
    },
    onError: (error: any) => {
      console.error("Error adding job:", error);
      toast({
        title: "Error",
        description: "Failed to post job",
        variant: "destructive"
      });
    }
  });

  // Update job mutation
  const updateJobMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<JobFormData> }) =>
      updateJob(id, updates),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Job updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setIsEditJobModalOpen(false);
      setSelectedJob(null);
    },
    onError: (error: any) => {
      console.error("Error updating job:", error);
      toast({
        title: "Error",
        description: "Failed to update job",
        variant: "destructive"
      });
    }
  });

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Job deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setIsDeleteJobConfirmOpen(false);
      setSelectedJob(null);
    },
    onError: (error: any) => {
      console.error("Error deleting job:", error);
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive"
      });
    }
  });

  // Handle freelancer search
  const handleSearchFreelancers = (specialty?: string, location?: string) => {
    searchFreelancersMutation.mutate({ specialty, location });
  };

  // Handle portfolio linking
  const handleLinkPortfolio = (freelancerId: string, portfolioId: string) => {
    linkPortfolioMutation.mutate({ freelancerId, portfolioId });
  };

  // Handle job operations
  const handleAddJob = (jobData: JobFormData) => {
    addJobMutation.mutate(jobData);
  };

  const handleUpdateJob = (id: string, updates: Partial<JobFormData>) => {
    updateJobMutation.mutate({ id, updates });
  };

  const handleDeleteJob = (id: string) => {
    deleteJobMutation.mutate(id);
  };

  // Handle portfolio viewing
  const handleViewPortfolio = (freelancer: FreelancerWithPortfolio) => {
    setSelectedFreelancer(freelancer);
    setShowPortfolioModal(true);
  };

  const handleClosePortfolioModal = () => {
    setShowPortfolioModal(false);
    setSelectedFreelancer(null);
  };

  // Handle enlist status toggle
  const handleToggleEnlistStatus = () => {
    if (currentUserFreelancer?.id) {
      toggleEnlistMutation.mutate(currentUserFreelancer.id);
    }
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
    // Data
    freelancers: filteredFreelancers,
    jobs,
    selectedFreelancer,
    currentUserFreelancer,
    
    // Loading states
    isLoadingFreelancers,
    isLoadingJobs,
    isLoadingCurrentUserFreelancer,
    isSearching: searchFreelancersMutation.isPending,
    isLinkingPortfolio: linkPortfolioMutation.isPending,
    isAddingJob: addJobMutation.isPending,
    isUpdatingJob: updateJobMutation.isPending,
    isDeletingJob: deleteJobMutation.isPending,
    
    // Search and filters
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    
    // Modals and UI state
    showPostJob,
    setShowPostJob,
    showPortfolioModal,
    setShowPortfolioModal,
    isEditJobModalOpen,
    setIsEditJobModalOpen,
    isDeleteJobConfirmOpen,
    setIsDeleteJobConfirmOpen,
    
    // Job operations
    selectedJob,
    setSelectedJob,
    handleAddJob,
    handleUpdateJob,
    handleDeleteJob,
    handleEditJob,
    handleConfirmDeleteJob,
    
    // Freelancer operations
    handleSearchFreelancers,
    handleLinkPortfolio,
    handleViewPortfolio,
    handleClosePortfolioModal,
    handleToggleEnlistStatus,
    
    // Search results
    searchResults: searchFreelancersMutation.data || [],
  };
}