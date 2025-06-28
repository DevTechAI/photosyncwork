import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore";
import { firestore } from "@/integrations/google/firebaseConfig";
import { FinanceTransaction } from "./types";

export const fetchTransactions = async (filters?: {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  subcategoryId?: string;
  type?: 'income' | 'expense';
  sourceId?: string;
  sourceType?: string;
}): Promise<FinanceTransaction[]> => {
  try {
    const transactionsRef = collection(firestore, "finance_transactions");
    let q = query(transactionsRef, orderBy("transaction_date", "desc"));
    
    if (filters) {
      if (filters.startDate) {
        q = query(q, where("transaction_date", ">=", filters.startDate));
      }
      if (filters.endDate) {
        q = query(q, where("transaction_date", "<=", filters.endDate));
      }
      if (filters.categoryId) {
        q = query(q, where("category_id", "==", filters.categoryId));
      }
      if (filters.subcategoryId) {
        q = query(q, where("subcategory_id", "==", filters.subcategoryId));
      }
      if (filters.type) {
        q = query(q, where("transaction_type", "==", filters.type));
      }
      if (filters.sourceId) {
        q = query(q, where("source_id", "==", filters.sourceId));
      }
      if (filters.sourceType) {
        q = query(q, where("source_type", "==", filters.sourceType));
      }
    }
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      amount: Number(doc.data().amount)
    })) as FinanceTransaction[];
  } catch (error) {
    console.error("Error in fetchTransactions:", error);
    throw error;
  }
};

export const fetchTransactionsBySource = async (sourceId: string, sourceType?: string): Promise<FinanceTransaction[]> => {
  try {
    const transactionsRef = collection(firestore, "finance_transactions");
    let q = query(
      transactionsRef, 
      where("source_id", "==", sourceId),
      orderBy("transaction_date", "desc")
    );
    
    if (sourceType) {
      q = query(q, where("source_type", "==", sourceType));
    }
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      amount: Number(doc.data().amount)
    })) as FinanceTransaction[];
  } catch (error) {
    console.error("Error in fetchTransactionsBySource:", error);
    throw error;
  }
};

export const addTransaction = async (transaction: Omit<FinanceTransaction, 'id' | 'created_at' | 'updated_at'>): Promise<FinanceTransaction> => {
  try {
    const transactionsRef = collection(firestore, "finance_transactions");
    
    const transactionData = {
      ...transaction,
      amount: Number(transaction.amount),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const docRef = await addDoc(transactionsRef, transactionData);
    
    return {
      id: docRef.id,
      ...transactionData
    } as FinanceTransaction;
  } catch (error) {
    console.error("Error in addTransaction:", error);
    throw error;
  }
};

export const updateTransaction = async (transaction: FinanceTransaction): Promise<FinanceTransaction> => {
  try {
    const { id, created_at, ...updateData } = transaction;
    
    const transactionRef = doc(firestore, "finance_transactions", id);
    
    await updateDoc(transactionRef, {
      ...updateData,
      amount: Number(updateData.amount),
      updated_at: new Date().toISOString()
    });
    
    // Get the updated document
    const docSnap = await getDoc(transactionRef);
    
    return {
      id: docSnap.id,
      ...docSnap.data(),
      amount: Number(docSnap.data().amount)
    } as FinanceTransaction;
  } catch (error) {
    console.error("Error in updateTransaction:", error);
    throw error;
  }
};

export const deleteTransaction = async (id: string): Promise<void> => {
  try {
    const transactionRef = doc(firestore, "finance_transactions", id);
    await deleteDoc(transactionRef);
  } catch (error) {
    console.error("Error in deleteTransaction:", error);
    throw error;
  }
};