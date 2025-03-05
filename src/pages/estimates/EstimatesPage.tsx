
import Layout from "@/components/Layout";
import { EstimatesHeader } from "@/components/estimates/list/EstimatesHeader";
import { EstimatesTabs } from "@/components/estimates/list/EstimatesTabs";
import { EstimateForm } from "@/components/estimates/EstimateForm";
import { EstimatePreview } from "@/components/estimates/EstimatePreview";
import { useEstimatesPage } from "@/hooks/estimates/useEstimatesPage";

export default function EstimatesPage() {
  const {
    showNewEstimateForm,
    selectedEstimate,
    showPreview,
    isEditing,
    currentTab,
    filteredEstimates,
    setCurrentTab,
    handleEditEstimate,
    handleOpenPreview,
    handleStatusChange,
    handleQuickStatusChange,
    handleGoToScheduling,
    handleCreateNewEstimate,
    handleCloseForm,
    handleClosePreview
  } = useEstimatesPage();

  return (
    <Layout>
      <div className="space-y-6">
        <EstimatesHeader onNewEstimate={handleCreateNewEstimate} />
        
        <EstimatesTabs
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          filteredEstimates={filteredEstimates}
          onEdit={handleEditEstimate}
          onPreview={handleOpenPreview}
          onStatusChange={handleQuickStatusChange}
          onGoToScheduling={handleGoToScheduling}
          onNewEstimate={handleCreateNewEstimate}
        />

        <EstimateForm
          open={showNewEstimateForm}
          onClose={handleCloseForm}
          editingEstimate={isEditing ? selectedEstimate : null}
        />

        {selectedEstimate && (
          <EstimatePreview
            open={showPreview}
            onClose={handleClosePreview}
            estimate={selectedEstimate}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </Layout>
  );
}
