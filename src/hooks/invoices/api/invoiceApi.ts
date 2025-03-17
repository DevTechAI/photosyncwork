
import { supabase } from "@/integrations/supabase/client";
import { Invoice } from "@/components/invoices/types";
import { Json } from "@/integrations/supabase/types";

// Convert from our application type to database type
export const mapInvoiceToDbInvoice = (invoice: Invoice) => {
  return {
    id: invoice.id || undefined, // If empty string, make it undefined so Supabase generates one
    client: invoice.client,
    client_email: invoice.clientEmail,
    date: invoice.date,
    amount: invoice.amount,
    paid_amount: invoice.paidAmount,
    balance_amount: invoice.balanceAmount,
    status: invoice.status,
    items: invoice.items as unknown as Json,
    estimate_id: invoice.estimateId,
    notes: invoice.notes,
    payment_date: invoice.paymentDate,
    payment_method: invoice.paymentMethod,
    gst_rate: invoice.gstRate
  };
};

// Convert from database type to our application type
export const mapDbInvoiceToInvoice = (item: any): Invoice => {
  return {
    id: item.id,
    client: item.client,
    clientEmail: item.client_email,
    date: item.date,
    amount: item.amount,
    paidAmount: item.paid_amount,
    balanceAmount: item.balance_amount,
    status: item.status as "pending" | "partial" | "paid",
    items: item.items as unknown as any[],
    estimateId: item.estimate_id,
    notes: item.notes,
    paymentDate: item.payment_date,
    paymentMethod: item.payment_method,
    gstRate: item.gst_rate
  };
};

// Fetch all invoices
export const fetchInvoices = async (): Promise<Invoice[]> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*');
  
  if (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
  
  return data.map(mapDbInvoiceToInvoice);
};

// Add a new invoice
export const addInvoice = async (invoice: Invoice): Promise<Invoice> => {
  const dbInvoice = mapInvoiceToDbInvoice(invoice);
  
  const { data, error } = await supabase
    .from('invoices')
    .insert(dbInvoice)
    .select()
    .single();
    
  if (error) {
    console.error("Error adding invoice:", error);
    throw error;
  }
  
  return mapDbInvoiceToInvoice(data);
};

// Update an existing invoice
export const updateInvoice = async (invoice: Invoice): Promise<Invoice> => {
  const dbInvoice = mapInvoiceToDbInvoice(invoice);
  // Remove id from update data as it's used in the where clause
  const { id, ...updateData } = dbInvoice;
  
  const { data, error } = await supabase
    .from('invoices')
    .update(updateData)
    .eq('id', invoice.id)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
  
  return mapDbInvoiceToInvoice(data);
};
