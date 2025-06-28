import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "@/integrations/google/firebaseConfig";
import { TransactionStats } from "./types";
import { FinanceTransaction } from "./types";

export const getTransactionStats = async (
  startDate: string,
  endDate: string
): Promise<TransactionStats> => {
  try {
    // Fetch all transactions in date range
    const transactionsRef = collection(firestore, "finance_transactions");
    const q = query(
      transactionsRef,
      where("transaction_date", ">=", startDate),
      where("transaction_date", "<=", endDate)
    );
    
    const querySnapshot = await getDocs(q);
    
    // Process transactions
    const transactions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      amount: Number(doc.data().amount)
    })) as FinanceTransaction[];
    
    // Fetch categories for these transactions
    const categoryIds = [...new Set(transactions.map(t => t.category_id))];
    const categoriesMap: Record<string, string> = {};
    
    for (const categoryId of categoryIds) {
      const categoryRef = doc(firestore, "finance_categories", categoryId);
      const categorySnap = await getDoc(categoryRef);
      
      if (categorySnap.exists()) {
        categoriesMap[categoryId] = categorySnap.data().name;
      }
    }
    
    // Calculate totals
    const totalIncome = transactions
      .filter(t => t.transaction_type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    const totalExpense = transactions
      .filter(t => t.transaction_type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    // Group by category
    const incomeByCategory: { category: string; amount: number }[] = [];
    const expenseByCategory: { category: string; amount: number }[] = [];
    
    const incomeCategories: Record<string, number> = {};
    const expenseCategories: Record<string, number> = {};
    
    for (const transaction of transactions) {
      const categoryName = categoriesMap[transaction.category_id] || 'Uncategorized';
      const amount = Number(transaction.amount);
      
      if (transaction.transaction_type === 'income') {
        if (!incomeCategories[categoryName]) {
          incomeCategories[categoryName] = 0;
        }
        incomeCategories[categoryName] += amount;
      } else {
        if (!expenseCategories[categoryName]) {
          expenseCategories[categoryName] = 0;
        }
        expenseCategories[categoryName] += amount;
      }
    }
    
    for (const [category, amount] of Object.entries(incomeCategories)) {
      incomeByCategory.push({ category, amount });
    }
    
    for (const [category, amount] of Object.entries(expenseCategories)) {
      expenseByCategory.push({ category, amount });
    }
    
    return {
      totalIncome,
      totalExpense,
      netAmount: totalIncome - totalExpense,
      incomeByCategory,
      expenseByCategory
    };
  } catch (error) {
    console.error("Error in getTransactionStats:", error);
    throw error;
  }
};

// Helper function to get a document by ID
const getDoc = async (docRef: any) => {
  try {
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      return {
        exists: () => true,
        data: () => docSnap.data()
      };
    }
    return {
      exists: () => false,
      data: () => null
    };
  } catch (error) {
    console.error("Error in getDoc:", error);
    throw error;
  }
};