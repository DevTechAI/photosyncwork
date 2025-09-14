import { useState, useEffect } from 'react';
import { 
  getQuoteEnquiries, 
  getPendingQuoteEnquiries, 
  getQuoteEnquiryById,
  acceptQuoteEnquiry,
  rejectQuoteEnquiry,
  createQuoteEnquiry,
  updateQuoteEnquiry,
  deleteQuoteEnquiry,
  getQuoteEnquiryMetrics,
  getPendingQuoteEnquiriesCount,
  QuoteEnquiry,
  QuoteEnquiryMetrics
} from './queries';

// =====================================================
// Quote Enquiries Hook Types
// =====================================================

export interface UseQuoteEnquiriesReturn {
  enquiries: QuoteEnquiry[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UsePendingQuoteEnquiriesReturn {
  pendingEnquiries: QuoteEnquiry[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseQuoteEnquiryReturn {
  enquiry: QuoteEnquiry | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseQuoteEnquiryActionsReturn {
  acceptEnquiry: (id: string) => Promise<boolean>;
  rejectEnquiry: (id: string) => Promise<boolean>;
  createEnquiry: (enquiry: Omit<QuoteEnquiry, 'id' | 'created_at' | 'updated_at'>) => Promise<QuoteEnquiry | null>;
  updateEnquiry: (id: string, updates: Partial<QuoteEnquiry>) => Promise<boolean>;
  deleteEnquiry: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export interface UseQuoteEnquiryMetricsReturn {
  metrics: QuoteEnquiryMetrics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UsePendingQuoteEnquiriesCountReturn {
  count: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// =====================================================
// Quote Enquiries Hooks
// =====================================================

/**
 * Hook for all quote enquiries
 */
export function useQuoteEnquiries(): UseQuoteEnquiriesReturn {
  const [enquiries, setEnquiries] = useState<QuoteEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getQuoteEnquiries();
      setEnquiries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quote enquiries');
      console.error('Quote enquiries fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchEnquiries();
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  return {
    enquiries,
    loading,
    error,
    refetch
  };
}

/**
 * Hook for pending quote enquiries only
 */
export function usePendingQuoteEnquiries(): UsePendingQuoteEnquiriesReturn {
  const [pendingEnquiries, setPendingEnquiries] = useState<QuoteEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingEnquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPendingQuoteEnquiries();
      setPendingEnquiries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pending quote enquiries');
      console.error('Pending quote enquiries fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchPendingEnquiries();
  };

  useEffect(() => {
    fetchPendingEnquiries();
  }, []);

  return {
    pendingEnquiries,
    loading,
    error,
    refetch
  };
}

/**
 * Hook for a single quote enquiry by ID
 */
export function useQuoteEnquiry(id: string): UseQuoteEnquiryReturn {
  const [enquiry, setEnquiry] = useState<QuoteEnquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnquiry = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getQuoteEnquiryById(id);
      setEnquiry(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quote enquiry');
      console.error('Quote enquiry fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchEnquiry();
  };

  useEffect(() => {
    if (id) {
      fetchEnquiry();
    }
  }, [id]);

  return {
    enquiry,
    loading,
    error,
    refetch
  };
}

/**
 * Hook for quote enquiry actions (accept, reject, create, update, delete)
 */
export function useQuoteEnquiryActions(): UseQuoteEnquiryActionsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptEnquiry = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const success = await acceptQuoteEnquiry(id);
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept quote enquiry');
      console.error('Accept quote enquiry error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const rejectEnquiry = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const success = await rejectQuoteEnquiry(id);
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject quote enquiry');
      console.error('Reject quote enquiry error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createEnquiry = async (enquiry: Omit<QuoteEnquiry, 'id' | 'created_at' | 'updated_at'>): Promise<QuoteEnquiry | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await createQuoteEnquiry(enquiry);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quote enquiry');
      console.error('Create quote enquiry error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateEnquiry = async (id: string, updates: Partial<QuoteEnquiry>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const success = await updateQuoteEnquiry(id, updates);
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quote enquiry');
      console.error('Update quote enquiry error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteEnquiry = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const success = await deleteQuoteEnquiry(id);
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete quote enquiry');
      console.error('Delete quote enquiry error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    acceptEnquiry,
    rejectEnquiry,
    createEnquiry,
    updateEnquiry,
    deleteEnquiry,
    loading,
    error
  };
}

/**
 * Hook for quote enquiry metrics
 */
export function useQuoteEnquiryMetrics(): UseQuoteEnquiryMetricsReturn {
  const [metrics, setMetrics] = useState<QuoteEnquiryMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getQuoteEnquiryMetrics();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quote enquiry metrics');
      console.error('Quote enquiry metrics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchMetrics();
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return {
    metrics,
    loading,
    error,
    refetch
  };
}

/**
 * Hook for pending quote enquiries count (for dashboard)
 */
export function usePendingQuoteEnquiriesCount(): UsePendingQuoteEnquiriesCountReturn {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCount = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPendingQuoteEnquiriesCount();
      setCount(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pending quote enquiries count');
      console.error('Pending quote enquiries count fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchCount();
  };

  useEffect(() => {
    fetchCount();
  }, []);

  return {
    count,
    loading,
    error,
    refetch
  };
}
