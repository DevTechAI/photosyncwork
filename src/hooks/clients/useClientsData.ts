import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchClients, addClient, updateClient, deleteClient } from "./api/clientApi";
import { Client, ClientFormData } from "@/types/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function useClientsData() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Fetch clients
  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
    onError: (error: any) => {
      toast({
        title: "Error fetching clients",
        description: error.message || "Failed to load clients",
        variant: "destructive"
      });
    }
  });

  // Add client mutation
  const addClientMutation = useMutation({
    mutationFn: (clientData: ClientFormData) => addClient(clientData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client added",
        description: "Client has been added successfully"
      });
      setIsAddClientModalOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error adding client",
        description: error.message || "Failed to add client",
        variant: "destructive"
      });
    }
  });

  // Update client mutation
  const updateClientMutation = useMutation({
    mutationFn: (client: Client) => updateClient(client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client updated",
        description: "Client has been updated successfully"
      });
      setIsEditClientModalOpen(false);
      setSelectedClient(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error updating client",
        description: error.message || "Failed to update client",
        variant: "destructive"
      });
    }
  });

  // Delete client mutation
  const deleteClientMutation = useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client deleted",
        description: "Client has been deleted successfully"
      });
      setIsDeleteConfirmOpen(false);
      setSelectedClient(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting client",
        description: error.message || "Failed to delete client",
        variant: "destructive"
      });
    }
  });

  // Handle adding a new client
  const handleAddClient = (clientData: ClientFormData) => {
    addClientMutation.mutate(clientData);
  };

  // Handle updating a client
  const handleUpdateClient = (clientData: ClientFormData) => {
    if (!selectedClient) return;
    
    const updatedClient: Client = {
      ...selectedClient,
      ...clientData,
      updated_at: new Date().toISOString()
    };
    
    updateClientMutation.mutate(updatedClient);
  };

  // Handle deleting a client
  const handleDeleteClient = () => {
    if (!selectedClient) return;
    deleteClientMutation.mutate(selectedClient.id);
  };

  // Open edit modal for a client
  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsEditClientModalOpen(true);
  };

  // Open delete confirmation for a client
  const handleConfirmDelete = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteConfirmOpen(true);
  };

  return {
    clients,
    isLoading,
    error,
    selectedClient,
    isAddClientModalOpen,
    isEditClientModalOpen,
    isDeleteConfirmOpen,
    setIsAddClientModalOpen,
    setIsEditClientModalOpen,
    setIsDeleteConfirmOpen,
    handleAddClient,
    handleUpdateClient,
    handleDeleteClient,
    handleEditClient,
    handleConfirmDelete
  };
}