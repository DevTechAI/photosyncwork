import { supabase } from "@/integrations/supabase/client";
import { FinanceSubcategory } from "./types";

export const fetchSubcategories = async (categoryId?: string): Promise<FinanceSubcategory[]> => {
  try {
    const subcategoriesRef = collection(firestore, "finance_subcategories");
    let q = query(subcategoriesRef, orderBy("name"));
    
    if (categoryId) {
      q = query(subcategoriesRef, where("category_id", "==", categoryId), orderBy("name"));
    }
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FinanceSubcategory[];
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
};

export const addSubcategory = async (subcategory: Omit<FinanceSubcategory, 'id' | 'created_at' | 'updated_at'>): Promise<FinanceSubcategory> => {
  try {
    const subcategoriesRef = collection(firestore, "finance_subcategories");
    
    const subcategoryData = {
      ...subcategory,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const docRef = await addDoc(subcategoriesRef, subcategoryData);
    
    return {
      id: docRef.id,
      ...subcategoryData
    } as FinanceSubcategory;
  } catch (error) {
    console.error("Error adding subcategory:", error);
    throw error;
  }
};

export const updateSubcategory = async (subcategory: FinanceSubcategory): Promise<FinanceSubcategory> => {
  try {
    const { id, created_at, ...updateData } = subcategory;
    
    const subcategoryRef = doc(firestore, "finance_subcategories", id);
    
    await updateDoc(subcategoryRef, {
      ...updateData,
      updated_at: new Date().toISOString()
    });
    
    // Get the updated document
    const docSnap = await getDoc(subcategoryRef);
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as FinanceSubcategory;
  } catch (error) {
    console.error("Error updating subcategory:", error);
    throw error;
  }
};

export const deleteSubcategory = async (id: string): Promise<void> => {
  try {
    const subcategoryRef = doc(firestore, "finance_subcategories", id);
    await deleteDoc(subcategoryRef);
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    throw error;
  }
};

export const bulkImportSubcategories = async (subcategories: Array<Omit<FinanceSubcategory, 'id' | 'created_at' | 'updated_at'>>): Promise<FinanceSubcategory[]> => {
  try {
    const subcategoriesRef = collection(firestore, "finance_subcategories");
    const results: FinanceSubcategory[] = [];
    
    // Add each subcategory
    for (const subcategory of subcategories) {
      const subcategoryData = {
        ...subcategory,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const docRef = await addDoc(subcategoriesRef, subcategoryData);
      
      results.push({
        id: docRef.id,
        ...subcategoryData
      } as FinanceSubcategory);
    }
    
    return results;
  } catch (error) {
    console.error("Error bulk importing subcategories:", error);
    throw error;
  }
};