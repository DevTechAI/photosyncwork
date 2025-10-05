import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";

/**
 * Fetch all clients from Firestore
 */
export const fetchClients = async (): Promise<Client[]> => {
  try {
    const clientsRef = collection(firestore, "clients");
    const q = query(clientsRef, orderBy("name"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Client[];
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
};

/**
 * Add a new client to Firestore
 */
export const addClient = async (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> => {
  try {
    const clientsRef = collection(firestore, "clients");
    
    const clientData = {
      ...client,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const docRef = await addDoc(clientsRef, clientData);
    
    return {
      id: docRef.id,
      ...clientData
    } as Client;
  } catch (error) {
    console.error("Error adding client:", error);
    throw error;
  }
};

/**
 * Update an existing client in Firestore
 */
export const updateClient = async (client: Client): Promise<Client> => {
  try {
    const { id, created_at, ...updateData } = client;
    
    const clientRef = doc(firestore, "clients", id);
    
    await updateDoc(clientRef, {
      ...updateData,
      updated_at: new Date().toISOString()
    });
    
    // Get the updated document
    const docSnap = await getDoc(clientRef);
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Client;
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
};

/**
 * Delete a client from Firestore
 */
export const deleteClient = async (id: string): Promise<void> => {
  try {
    const clientRef = doc(firestore, "clients", id);
    await deleteDoc(clientRef);
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
};

/**
 * Fetch a single client by ID from Firestore
 */
export const fetchClientById = async (id: string): Promise<Client | null> => {
  try {
    const clientRef = doc(firestore, "clients", id);
    const docSnap = await getDoc(clientRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Client;
  } catch (error) {
    console.error("Error fetching client by ID:", error);
    return null;
  }
};