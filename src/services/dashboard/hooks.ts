import { useState, useEffect } from 'react';
import { getDashboardData, DashboardData, DashboardMetrics } from './queries';

// =====================================================
// Dashboard Hook Types
// =====================================================

export interface UseDashboardReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  metrics: DashboardMetrics | null;
}

// =====================================================
// Dashboard Hook
// =====================================================

/**
 * Custom hook for dashboard data management
 * Provides loading states, error handling, and refetch functionality
 */
export function useDashboard(): UseDashboardReturn {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await getDashboardData();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    metrics: data?.metrics || null
  };
}

// =====================================================
// Individual Metric Hooks (Optional)
// =====================================================

/**
 * Hook for individual dashboard metrics
 * Useful when you only need specific metrics
 */
export function useDashboardMetric<T>(
  metricName: keyof DashboardMetrics,
  fetchFunction: () => Promise<T>
) {
  const [value, setValue] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetric = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setValue(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to fetch ${metricName}`);
      console.error(`${metricName} fetch error:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetric();
  }, []);

  return {
    value,
    loading,
    error,
    refetch: fetchMetric
  };
}
