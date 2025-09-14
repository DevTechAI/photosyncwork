import { supabase } from '../../integrations/supabase/client';

// =====================================================
// Quote Enquiries Query Types
// =====================================================

export interface QuoteEnquiry {
  id: string;
  enquiry_id: string;
  request_details: string;
  shoot_start_date: string;
  shoot_end_date: string;
  quote_amount: number;
  customer_phone?: string;
  customer_email?: string;
  customer_name: string;
  enquiry_datetime_stamp: string;
  status: 'pending' | 'accepted' | 'rejected';
  received_date: string;
  created_at: string;
  updated_at: string;
}

export interface QuoteEnquiryMetrics {
  totalEnquiries: number;
  pendingEnquiries: number;
  acceptedEnquiries: number;
  rejectedEnquiries: number;
  totalQuoteValue: number;
  pendingQuoteValue: number;
}

// =====================================================
// Quote Enquiries Queries
// =====================================================

/**
 * Get all quote enquiries
 */
export async function getQuoteEnquiries(): Promise<QuoteEnquiry[]> {
  try {
    const { data, error } = await supabase
      .from('quote_enquiries')
      .select('*')
      .order('enquiry_datetime_stamp', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching quote enquiries:', error);
    return [];
  }
}

/**
 * Get pending quote enquiries
 */
export async function getPendingQuoteEnquiries(): Promise<QuoteEnquiry[]> {
  try {
    const { data, error } = await supabase
      .from('quote_enquiries')
      .select('*')
      .eq('status', 'pending')
      .order('enquiry_datetime_stamp', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching pending quote enquiries:', error);
    return [];
  }
}

/**
 * Get quote enquiry by ID
 */
export async function getQuoteEnquiryById(id: string): Promise<QuoteEnquiry | null> {
  try {
    const { data, error } = await supabase
      .from('quote_enquiries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching quote enquiry by ID:', error);
    return null;
  }
}

/**
 * Accept a quote enquiry
 */
export async function acceptQuoteEnquiry(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('quote_enquiries')
      .update({ 
        status: 'accepted',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error accepting quote enquiry:', error);
    return false;
  }
}

/**
 * Reject a quote enquiry
 */
export async function rejectQuoteEnquiry(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('quote_enquiries')
      .update({ 
        status: 'rejected',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error rejecting quote enquiry:', error);
    return false;
  }
}

/**
 * Create a new quote enquiry
 */
export async function createQuoteEnquiry(enquiry: Omit<QuoteEnquiry, 'id' | 'created_at' | 'updated_at'>): Promise<QuoteEnquiry | null> {
  try {
    const { data, error } = await supabase
      .from('quote_enquiries')
      .insert([enquiry])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating quote enquiry:', error);
    return null;
  }
}

/**
 * Update a quote enquiry
 */
export async function updateQuoteEnquiry(id: string, updates: Partial<QuoteEnquiry>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('quote_enquiries')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating quote enquiry:', error);
    return false;
  }
}

/**
 * Delete a quote enquiry
 */
export async function deleteQuoteEnquiry(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('quote_enquiries')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting quote enquiry:', error);
    return false;
  }
}

/**
 * Get quote enquiry metrics
 */
export async function getQuoteEnquiryMetrics(): Promise<QuoteEnquiryMetrics> {
  try {
    const { data, error } = await supabase
      .from('quote_enquiries')
      .select('status, quote_amount');

    if (error) throw error;

    const enquiries = data || [];

    return {
      totalEnquiries: enquiries.length,
      pendingEnquiries: enquiries.filter(e => e.status === 'pending').length,
      acceptedEnquiries: enquiries.filter(e => e.status === 'accepted').length,
      rejectedEnquiries: enquiries.filter(e => e.status === 'rejected').length,
      totalQuoteValue: enquiries.reduce((sum, e) => sum + (e.quote_amount || 0), 0),
      pendingQuoteValue: enquiries.filter(e => e.status === 'pending').reduce((sum, e) => sum + (e.quote_amount || 0), 0)
    };
  } catch (error) {
    console.error('Error fetching quote enquiry metrics:', error);
    return {
      totalEnquiries: 0,
      pendingEnquiries: 0,
      acceptedEnquiries: 0,
      rejectedEnquiries: 0,
      totalQuoteValue: 0,
      pendingQuoteValue: 0
    };
  }
}

/**
 * Get count of pending quote enquiries
 */
export async function getPendingQuoteEnquiriesCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('quote_enquiries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error fetching pending quote enquiries count:', error);
    return 0;
  }
}
