import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore";
import { firestore } from "@/integrations/google/firebaseConfig";
import { FinanceCategory } from "./types";

export const fetchCategories = async (): Promise<FinanceCategory[]> => {
  try {
    const categoriesRef = collection(firestore, "finance_categories");
    const q = query(categoriesRef, orderBy("name"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FinanceCategory[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const addCategory = async (category: Omit<FinanceCategory, 'id' | 'created_at' | 'updated_at'>): Promise<FinanceCategory> => {
  try {
    const categoriesRef = collection(firestore, "finance_categories");
    
    const categoryData = {
      ...category,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const docRef = await addDoc(categoriesRef, categoryData);
    
    return {
      id: docRef.id,
      ...categoryData
    } as FinanceCategory;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

export const updateCategory = async (category: FinanceCategory): Promise<FinanceCategory> => {
  try {
    const { id, created_at, ...updateData } = category;
    
    const categoryRef = doc(firestore, "finance_categories", id);
    
    await updateDoc(categoryRef, {
      ...updateData,
      updated_at: new Date().toISOString()
    });
    
    // Get the updated document
    const docSnap = await getDoc(categoryRef);
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as FinanceCategory;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const categoryRef = doc(firestore, "finance_categories", id);
    await deleteDoc(categoryRef);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

export const bulkImportCategories = async (categories: Array<Omit<FinanceCategory, 'id' | 'created_at' | 'updated_at'>>): Promise<FinanceCategory[]> => {
  try {
    const categoriesRef = collection(firestore, "finance_categories");
    const results: FinanceCategory[] = [];
    
    // Add each category
    for (const category of categories) {
      const categoryData = {
        ...category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const docRef = await addDoc(categoriesRef, categoryData);
      
      results.push({
        id: docRef.id,
        ...categoryData
      } as FinanceCategory);
    }
    
    return results;
  } catch (error) {
    console.error("Error bulk importing categories:", error);
    throw error;
  }
};