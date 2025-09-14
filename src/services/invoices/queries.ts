import { supabase } from '../../integrations/supabase/client';

// =====================================================
// Invoices Query Types
// =====================================================

export interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email?: string;
  amount: number;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceMetrics {
  totalInvoices: number;
  pendingInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  totalAmount: number;
  pendingAmount: number;
}

// =====================================================
// Invoices Queries
// =====================================================

/**
 * Get all invoices
 */
export async function getInvoices(): Promise<Invoice[]> {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
}

/**
 * Get pending invoices
 */
export async function getPendingInvoices(): Promise<Invoice[]> {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('status', 'pending')
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching pending invoices:', error);
    return [];
  }
}

/**
 * Get invoice metrics
 */
export async function getInvoiceMetrics(): Promise<InvoiceMetrics> {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('amount, status');

    if (error) throw error;

    const invoices = data || [];

    return {
      totalInvoices: invoices.length,
      pendingInvoices: invoices.filter(i => i.status === 'pending').length,
      paidInvoices: invoices.filter(i => i.status === 'paid').length,
      overdueInvoices: invoices.filter(i => i.status === 'overdue').length,
      totalAmount: invoices.reduce((sum, i) => sum + (i.amount || 0), 0),
      pendingAmount: invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + (i.amount || 0), 0)
    };
  } catch (error) {
    console.error('Error fetching invoice metrics:', error);
    return {
      totalInvoices: 0,
      pendingInvoices: 0,
      paidInvoices: 0,
      overdueInvoices: 0,
      totalAmount: 0,
      pendingAmount: 0
    };
  }
}
