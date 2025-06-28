import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientStats } from "@/components/clients/ClientStats";
import { ClientsList } from "@/components/clients/ClientsList";
import { ClientForm } from "@/components/clients/ClientForm";
import { useClientsData } from "@/hooks/clients/useClientsData";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ClientsTab() {
  const {
    clients,
    isLoading,
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
  } = useClientsData();

  return (
    <div className="space-y-6">
      <ClientStats />

      <Card>
        <CardHeader>
          <CardTitle>Client Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientsList 
            clients={clients}
            isLoading={isLoading}
            onAddClient={() => setIsAddClientModalOpen(true)}
            onEditClient={handleEditClient}
            onDeleteClient={handleConfirmDelete}
          />
        </CardContent>
      </Card>

      {/* Add Client Modal */}
      <ClientForm
        open={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        onSubmit={handleAddClient}
        title="Add New Client"
      />

      {/* Edit Client Modal */}
      {selectedClient && (
        <ClientForm
          open={isEditClientModalOpen}
          onClose={() => setIsEditClientModalOpen(false)}
          onSubmit={handleUpdateClient}
          initialData={{
            name: selectedClient.name,
            email: selectedClient.email,
            phone: selectedClient.phone,
            address: selectedClient.address
          }}
          title="Edit Client"
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the client "{selectedClient?.name}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteClient}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}