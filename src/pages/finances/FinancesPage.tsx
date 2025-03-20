
import React from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchCategories } from "@/hooks/finances/api/categoryApi";
import { useQuery } from "@tanstack/react-query";
import { TransactionForm } from "@/components/finances/transactions/TransactionForm";
import { TransactionsView } from "@/components/finances/transactions/TransactionsView";
import { FinancialReports } from "@/components/finances/reports/FinancialReports";
import { useFinancesPage } from "@/hooks/finances/useFinancesPage";
import { FinancesHeader } from "@/components/finances/overview/FinancesHeader";
import { FinancesOverviewTab } from "@/components/finances/overview/FinancesOverviewTab";

export default function FinancesPage() {
  const {
    isTransactionModalOpen,
    setIsTransactionModalOpen,
    activeTab,
    setActiveTab,
    selectedYear,
    setSelectedYear,
    summaryStats,
    handleNewTransaction,
    handleTransactionSubmit,
    revenueData
  } = useFinancesPage();
  
  // Use React Query to fetch categories
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  return (
    <Layout>
      <div className="space-y-8 animate-in">
        <FinancesHeader 
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          handleNewTransaction={handleNewTransaction}
        />

        <Tabs 
          defaultValue="overview" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="reports">Reports & Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-0">
            <FinancesOverviewTab 
              summaryStats={summaryStats}
              revenueData={revenueData}
            />
          </TabsContent>
          
          <TabsContent value="transactions" className="mt-0">
            <TransactionsView 
              categories={categories} 
              onAddTransaction={handleNewTransaction} 
            />
          </TabsContent>
          
          <TabsContent value="reports" className="mt-0">
            <FinancialReports year={selectedYear} />
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={isTransactionModalOpen} onOpenChange={setIsTransactionModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Record New Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm 
            onSubmit={handleTransactionSubmit} 
            categories={categories} 
            onCancel={() => setIsTransactionModalOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
