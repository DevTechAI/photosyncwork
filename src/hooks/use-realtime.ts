
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

// Define type for messages to solve TypeScript issues
interface RealtimeMessage {
  id: string;
  user_id: string;
  user_name: string;
  message: string;
  created_at: string;
}

export function useRealtime() {
  const { currentUser } = useUser();
  const [messages, setMessages] = useState<RealtimeMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch initial messages and set up subscription
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        
        // Since the realtime_messages table doesn't exist yet,
        // we'll just provide an empty array for now
        setMessages([]);
        setIsLoading(false);
        
        /* This is commented out since the realtime_messages table doesn't exist in our schema
        const { data, error } = await supabase
          .from('realtime_messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
          
        if (error) throw error;
        
        // We need a type assertion here since we're dealing with messages
        setMessages((data || []) as unknown as RealtimeMessage[]);
        */
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
    
    /* Commented out realtime subscription since table doesn't exist yet
    // Set up the realtime subscription
    const channel = supabase
      .channel('public:realtime_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'realtime_messages'
        },
        (payload) => {
          console.log('New message received:', payload);
          setMessages((current) => [payload.new as RealtimeMessage, ...current]);
        }
      )
      .subscribe();
      
    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
    */
  }, []);
  
  // Function to send a new message
  const sendMessage = async (messageText: string) => {
    if (!currentUser) return false;
    
    try {
      // For now, just log the message since table doesn't exist
      console.log("Would send message:", messageText);
      return true;
      
      /* This is commented out since the realtime_messages table doesn't exist
      const { error } = await supabase.from('realtime_messages').insert({
        user_id: currentUser.id,
        user_name: currentUser.name,
        message: messageText
      });
        
      if (error) throw error;
      */
      
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };
  
  return {
    messages,
    isLoading,
    sendMessage
  };
}
