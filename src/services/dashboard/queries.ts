import { supabase } from '../../integrations/supabase/client';

// =====================================================
// Dashboard Query Types
// =====================================================

export interface DashboardMetrics {
  monthlyRevenue: number;
  upcomingEvents: number;
  pendingInvoices: number;
  activeProjects: number;
  pendingEnquiries: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  lastUpdated: string;
}

// =====================================================
// Dashboard Queries
// =====================================================

/**
 * Get monthly revenue from income transactions
 */
export async function getMonthlyRevenue(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('finance_transactions')
      .select('amount')
      .eq('transaction_type', 'income')
      .gte('transaction_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

    if (error) throw error;

    return data?.reduce((sum, transaction) => sum + (transaction.amount || 0), 0) || 0;
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    return 0;
  }
}

/**
 * Get count of upcoming events
 */
export async function getUpcomingEventsCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('scheduled_events')
      .select('*', { count: 'exact', head: true })
      .gte('date', new Date().toISOString())
      .in('stage', ['planning', 'pre-production', 'production']);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error fetching upcoming events count:', error);
    return 0;
  }
}

/**
 * Get count of pending invoices
 */
export async function getPendingInvoicesCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error fetching pending invoices count:', error);
    return 0;
  }
}

/**
 * Get count of active projects
 */
export async function getActiveProjectsCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('scheduled_events')
      .select('*', { count: 'exact', head: true })
      .in('stage', ['planning', 'pre-production', 'production', 'post-production']);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error fetching active projects count:', error);
    return 0;
  }
}

/**
 * Get count of pending quote enquiries
 */
export async function getPendingEnquiriesCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('quote_enquiries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error fetching pending enquiries count:', error);
    return 0;
  }
}

/**
 * Get all dashboard metrics in one call
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const [monthlyRevenue, upcomingEvents, pendingInvoices, activeProjects, pendingEnquiries] = await Promise.all([
      getMonthlyRevenue(),
      getUpcomingEventsCount(),
      getPendingInvoicesCount(),
      getActiveProjectsCount(),
      getPendingEnquiriesCount()
    ]);

    return {
      monthlyRevenue,
      upcomingEvents,
      pendingInvoices,
      activeProjects,
      pendingEnquiries
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return {
      monthlyRevenue: 0,
      upcomingEvents: 0,
      pendingInvoices: 0,
      activeProjects: 0,
      pendingEnquiries: 0
    };
  }
}

/**
 * Get complete dashboard data with metadata
 */
export async function getDashboardData(): Promise<DashboardData> {
  try {
    const metrics = await getDashboardMetrics();
    
    return {
      metrics,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}
