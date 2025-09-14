import { supabase } from '../../integrations/supabase/client';

// =====================================================
// Events Query Types
// =====================================================

export interface ScheduledEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  stage: 'planning' | 'pre-production' | 'production' | 'post-production' | 'completed';
  client_id?: string;
  photographer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface EventMetrics {
  totalEvents: number;
  upcomingEvents: number;
  activeProjects: number;
  completedEvents: number;
}

// =====================================================
// Events Queries
// =====================================================

/**
 * Get all scheduled events
 */
export async function getScheduledEvents(): Promise<ScheduledEvent[]> {
  try {
    const { data, error } = await supabase
      .from('scheduled_events')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching scheduled events:', error);
    return [];
  }
}

/**
 * Get upcoming events
 */
export async function getUpcomingEvents(): Promise<ScheduledEvent[]> {
  try {
    const { data, error } = await supabase
      .from('scheduled_events')
      .select('*')
      .gte('date', new Date().toISOString())
      .in('stage', ['planning', 'pre-production', 'production'])
      .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
}

/**
 * Get event metrics
 */
export async function getEventMetrics(): Promise<EventMetrics> {
  try {
    const { data, error } = await supabase
      .from('scheduled_events')
      .select('stage, date');

    if (error) throw error;

    const events = data || [];
    const today = new Date().toISOString();

    return {
      totalEvents: events.length,
      upcomingEvents: events.filter(e => e.date >= today && ['planning', 'pre-production', 'production'].includes(e.stage)).length,
      activeProjects: events.filter(e => ['planning', 'pre-production', 'production', 'post-production'].includes(e.stage)).length,
      completedEvents: events.filter(e => e.stage === 'completed').length
    };
  } catch (error) {
    console.error('Error fetching event metrics:', error);
    return {
      totalEvents: 0,
      upcomingEvents: 0,
      activeProjects: 0,
      completedEvents: 0
    };
  }
}
