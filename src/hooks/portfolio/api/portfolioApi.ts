import { doc, collection, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore";
import { firestore } from "@/integrations/google/firebaseConfig";
import { Portfolio, PortfolioGalleryItem, PortfolioFormData } from "@/types/portfolio";
import { v4 as uuidv4 } from "uuid";

/**
 * Fetch a user's portfolio from Firestore
 */
export const fetchPortfolio = async (userId: string): Promise<Portfolio | null> => {
  try {
    const portfolioRef = doc(firestore, "portfolios", userId);
    const docSnap = await getDoc(portfolioRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return { id: docSnap.id, ...docSnap.data() } as Portfolio;
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return null;
  }
};

/**
 * Create a new portfolio for a user in Firestore
 */
export const createPortfolio = async (userId: string, portfolio: PortfolioFormData): Promise<Portfolio> => {
  try {
    const portfolioData: Portfolio = {
      id: userId,
      user_id: userId,
      name: portfolio.name,
      tagline: portfolio.tagline,
      about: portfolio.about,
      services: portfolio.services,
      contact: portfolio.contact,
      socialLinks: portfolio.socialLinks,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const portfolioRef = doc(firestore, "portfolios", userId);
    await setDoc(portfolioRef, portfolioData);
    
    return portfolioData;
  } catch (error) {
    console.error("Error creating portfolio:", error);
    throw error;
  }
};

/**
 * Update an existing portfolio in Firestore
 */
export const updatePortfolio = async (portfolioId: string, portfolio: PortfolioFormData): Promise<Portfolio> => {
  try {
    const portfolioRef = doc(firestore, "portfolios", portfolioId);
    
    const updateData = {
      name: portfolio.name,
      tagline: portfolio.tagline,
      about: portfolio.about,
      services: portfolio.services,
      contact: portfolio.contact,
      socialLinks: portfolio.socialLinks,
      updated_at: new Date().toISOString()
    };
    
    await updateDoc(portfolioRef, updateData);
    
    // Get the updated document
    const docSnap = await getDoc(portfolioRef);
    
    return { id: docSnap.id, ...docSnap.data() } as Portfolio;
  } catch (error) {
    console.error("Error updating portfolio:", error);
    throw error;
  }
};

/**
 * Fetch gallery items for a portfolio from Firestore
 */
export const fetchPortfolioGallery = async (portfolioId: string): Promise<PortfolioGalleryItem[]> => {
  try {
    const galleryRef = collection(firestore, "portfolio_gallery");
    const q = query(
      galleryRef, 
      where("portfolio_id", "==", portfolioId),
      orderBy("created_at", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PortfolioGalleryItem[];
  } catch (error) {
    console.error("Error fetching portfolio gallery:", error);
    return [];
  }
};

/**
 * Add a new gallery item to a portfolio in Firestore
 */
export const addGalleryItem = async (item: Omit<PortfolioGalleryItem, 'id' | 'created_at' | 'updated_at'>): Promise<PortfolioGalleryItem> => {
  try {
    const itemId = uuidv4();
    const galleryRef = doc(firestore, "portfolio_gallery", itemId);
    
    const itemData = {
      ...item,
      id: itemId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    await setDoc(galleryRef, itemData);
    
    return itemData as PortfolioGalleryItem;
  } catch (error) {
    console.error("Error adding gallery item:", error);
    throw error;
  }
};

/**
 * Delete a gallery item from a portfolio in Firestore
 */
export const deleteGalleryItem = async (itemId: string): Promise<void> => {
  try {
    const galleryRef = doc(firestore, "portfolio_gallery", itemId);
    await deleteDoc(galleryRef);
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    throw error;
  }
};