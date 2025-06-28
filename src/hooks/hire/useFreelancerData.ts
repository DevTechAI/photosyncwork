import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchFreelancers, 
  addFreelancer, 
  updateFreelancer, 
  deleteFreelancer 
} from "./api/freelancerApi";
import { Freelancer, FreelancerFormData } from "@/types/hire";
import { useToast } from "@/hooks/use-toast";

export function useFreelancerData() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);
  const [isAddFreelancerModalOpen, setIsAddFreelancerModalOpen] = useState(false);
  const [isEditFreelancerModalOpen, setIsEditFreelancerModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Fetch freelancers
  const { data: freelancers = [], isLoading } = useQuery({
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

  // Add freelancer mutation
  const addFreelancerMutation = useMutation({
    mutationFn: (freelancerData: FreelancerFormData) => addFreelancer(freelancerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freelancers'] });
      toast({
        title: "Freelancer Added",
        description: "Freelancer has been added successfully"
      });
      setIsAddFreelancerModalOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to add freelancer",
        variant: "destructive"
      });
    }
  });

  // Update freelancer mutation
  const updateFreelancerMutation = useMutation({
    mutationFn: (freelancer: Freelancer) => updateFreelancer(freelancer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freelancers'] });
      toast({
        title: "Freelancer Updated",
        description: "Freelancer has been updated successfully"
      });
      setIsEditFreelancerModalOpen(false);
      setSelectedFreelancer(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update freelancer",
        variant: "destructive"
      });
    }
  });

  // Delete freelancer mutation
  const deleteFreelancerMutation = useMutation({
    mutationFn: (id: string) => deleteFreelancer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freelancers'] });
      toast({
        title: "Freelancer Deleted",
        description: "Freelancer has been deleted successfully"
      });
      setIsDeleteConfirmOpen(false);
      setSelectedFreelancer(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to delete freelancer",
        variant: "destructive"
      });
    }
  });

  // Handle adding a new freelancer
  const handleAddFreelancer = (freelancerData: FreelancerFormData) => {
    addFreelancerMutation.mutate(freelancerData);
  };

  // Handle updating a freelancer
  const handleUpdateFreelancer = (freelancerData: FreelancerFormData) => {
    if (!selectedFreelancer) return;
    
    const updatedFreelancer: Freelancer = {
      ...selectedFreelancer,
      ...freelancerData,
      updated_at: new Date().toISOString()
    };
    
    updateFreelancerMutation.mutate(updatedFreelancer);
  };

  // Handle deleting a freelancer
  const handleDeleteFreelancer = () => {
    if (!selectedFreelancer) return;
    deleteFreelancerMutation.mutate(selectedFreelancer.id);
  };

  // Open edit modal for a freelancer
  const handleEditFreelancer = (freelancer: Freelancer) => {
    setSelectedFreelancer(freelancer);
    setIsEditFreelancerModalOpen(true);
  };

  // Open delete confirmation for a freelancer
  const handleConfirmDeleteFreelancer = (freelancer: Freelancer) => {
    setSelectedFreelancer(freelancer);
    setIsDeleteConfirmOpen(true);
  };

  return {
    freelancers,
    isLoading,
    selectedFreelancer,
    isAddFreelancerModalOpen,
    isEditFreelancerModalOpen,
    isDeleteConfirmOpen,
    setIsAddFreelancerModalOpen,
    setIsEditFreelancerModalOpen,
    setIsDeleteConfirmOpen,
    handleAddFreelancer,
    handleUpdateFreelancer,
    handleDeleteFreelancer,
    handleEditFreelancer,
    handleConfirmDeleteFreelancer
  };
}