import { supabase } from "@/integrations/supabase/client";
import { Invoice } from "@/components/invoices/types";
import { v4 as uuidv4 } from "uuid";

// Convert from our application type to Firestore type
export const mapInvoiceToFirestoreInvoice = (invoice: Invoice) => {
  return {
    id: invoice.id || undefined,
    display_number: invoice.displayNumber,
    client: invoice.client,
    client_email: invoice.clientEmail,
    date: invoice.date,
    amount: invoice.amount,
    paid_amount: invoice.paidAmount,
    balance_amount: invoice.balanceAmount,
    status: invoice.status,
    items: invoice.items,
    estimate_id: invoice.estimateId,
    notes: invoice.notes,
    payment_date: invoice.paymentDate,
    payment_method: invoice.paymentMethod,
    gst_rate: invoice.gstRate,
    payments: invoice.payments
  };
};

// Convert from Firestore type to our application type
export const mapFirestoreInvoiceToInvoice = (item: any): Invoice => {
  return {
    id: item.id,
    displayNumber: item.display_number,
    client: item.client,
    clientEmail: item.client_email,
    date: item.date,
    amount: item.amount,
    paidAmount: item.paid_amount,
    balanceAmount: item.balance_amount,
    status: item.status as "pending" | "partial" | "paid",
    items: item.items,
    estimateId: item.estimate_id,
    notes: item.notes,
    paymentDate: item.payment_date,
    paymentMethod: item.payment_method,
    gstRate: item.gst_rate,
    payments: item.payments || []
  };
};

// Function to generate a user-friendly invoice number
export const generateInvoiceNumber = async (): Promise<string> => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  
  // Get count of invoices this month to determine the next sequential number
  const invoicesRef = collection(firestore, "invoices");
  const q = query(invoicesRef);
  const querySnapshot = await getDocs(q);
  
  // Count invoices with the current month/year prefix
  const prefix = `INV-${year}${month}-`;
  let count = 0;
  
  querySnapshot.forEach(doc => {
    const data = doc.data();
    if (data.display_number && data.display_number.startsWith(prefix)) {
      count++;
    }
  });
  
  // Format: INV-YYYYMM-XXX where XXX is sequential
  const sequentialNumber = (count + 1).toString().padStart(3, '0');
  return `${prefix}${sequentialNumber}`;
};

// Fetch all invoices
export const fetchInvoices = async (): Promise<Invoice[]> => {
  try {
    const invoicesRef = collection(firestore, "invoices");
    const q = query(invoicesRef, orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => mapFirestoreInvoiceToInvoice({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

// Add a new invoice
export const addInvoice = async (invoice: Invoice): Promise<Invoice> => {
  try {
    // Generate friendly invoice number if not provided
    if (!invoice.displayNumber) {
      invoice.displayNumber = await generateInvoiceNumber();
    }
    
    // Generate ID if not provided
    if (!invoice.id) {
      invoice.id = uuidv4();
    }
    
    const invoiceData = mapInvoiceToFirestoreInvoice(invoice);
    const invoicesRef = collection(firestore, "invoices");
    
    const docRef = await addDoc(invoicesRef, invoiceData);
    
    return {
      ...invoice,
      id: docRef.id
    };
  } catch (error) {
    console.error("Error adding invoice:", error);
    throw error;
  }
};

// Update an existing invoice
export const updateInvoice = async (invoice: Invoice): Promise<Invoice> => {
  try {
    const invoiceData = mapInvoiceToFirestoreInvoice(invoice);
    // Remove id from update data as it's used in the where clause
    const { id, ...updateData } = invoiceData;
    
    const invoiceRef = doc(firestore, "invoices", invoice.id);
    await updateDoc(invoiceRef, updateData);
    
    // Get the updated document
    const docSnap = await getDoc(invoiceRef);
    
    return mapFirestoreInvoiceToInvoice({
      id: docSnap.id,
      ...docSnap.data()
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};