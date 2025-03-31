
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for AI-related functionality
 */
export class AIService {
  /**
   * Get AI-generated scheduling suggestions for an event
   */
  static async getSchedulingSuggestions(event: any, teamMembers: any[]) {
    try {
      const { data, error } = await supabase.functions.invoke('intelligent-scheduling', {
        body: {
          event: {
            id: event.id,
            name: event.name,
            date: event.date,
            location: event.location,
            photographersCount: event.photographersCount,
            videographersCount: event.videographersCount
          },
          teamMembers
        }
      });
      
      if (error) throw new Error(error.message);
      
      return data;
    } catch (error: any) {
      console.error("Error getting AI scheduling suggestions:", error);
      throw error;
    }
  }
  
  /**
   * Get AI-generated tags for media
   */
  static async getMediaTags(
    mediaType: 'image' | 'video',
    mediaUrl: string,
    eventContext?: {
      eventName?: string;
      clientName?: string;
      eventType?: string;
    }
  ) {
    try {
      const { data, error } = await supabase.functions.invoke('media-tagging', {
        body: {
          mediaType,
          mediaUrl,
          eventContext: eventContext || undefined
        }
      });
      
      if (error) throw new Error(error.message);
      
      return data;
    } catch (error: any) {
      console.error("Error generating media tags:", error);
      throw error;
    }
  }
}
