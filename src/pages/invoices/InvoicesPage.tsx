
import Layout from "@/components/Layout";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { InvoiceDetails } from "@/components/invoices/InvoiceDetails";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InvoiceStats } from "@/components/invoices/components/InvoiceStats";
import { InvoiceFilters } from "@/components/invoices/components/InvoiceFilters";
import { InvoicesList } from "@/components/invoices/components/InvoicesList";
import { useInvoices } from "@/hooks/invoices/useInvoices";

export default function InvoicesPage() {
  const {
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    showNewInvoice,
    setShowNewInvoice,
    selectedInvoice,
    setSelectedInvoice,
    filteredInvoices,
    addInvoice,
    updateInvoice,
    locationState
  } = useInvoices();

  const handleSaveInvoice = (invoice: any) => {
    if (selectedInvoice) {
      updateInvoice(invoice);
    } else {
      addInvoice(invoice);
    }
  };

  return (
    <Layout>
      <div className="space-y-8 animate-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Invoices</h1>
            <p className="text-muted-foreground mt-2">
              Manage your client invoices and payments
            </p>
          </div>
          <Button className="gap-2" onClick={() => setShowNewInvoice(true)}>
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
        </div>

        {/* Statistics Cards */}
        <InvoiceStats invoices={filteredInvoices} />

        {/* Search and Filter Bar */}
        <InvoiceFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Invoices List */}
        <InvoicesList 
          invoices={filteredInvoices}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onViewDetails={setSelectedInvoice}
        />
      </div>

      {/* Modals */}
      <InvoiceForm 
        open={showNewInvoice} 
        onClose={() => setShowNewInvoice(false)} 
        onSave={handleSaveInvoice}
        editingInvoice={null}
      />
      
      <InvoiceDetails
        invoice={selectedInvoice}
        open={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onEdit={() => {
          setShowNewInvoice(true);
        }}
      />
    </Layout>
  );
}
