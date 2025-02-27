
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
        
        // Use a non-typed approach with the generic client
        // @ts-ignore - Ignoring TypeScript for this line since we know the table exists
        const { data, error } = await supabase.from('realtime_messages').select('*')
          .order('created_at', { ascending: false })
          .limit(50);
          
        if (error) throw error;
        
        // Cast the data to our interface
        setMessages((data || []) as RealtimeMessage[]);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
    
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
  }, []);
  
  // Function to send a new message
  const sendMessage = async (messageText: string) => {
    if (!currentUser) return false;
    
    try {
      // @ts-ignore - Ignoring TypeScript for this line since we know the table exists
      const { error } = await supabase.from('realtime_messages').insert({
        user_id: currentUser.id,
        user_name: currentUser.name,
        message: messageText
      });
        
      if (error) throw error;
      
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
