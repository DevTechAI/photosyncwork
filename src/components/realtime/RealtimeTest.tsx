
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRealtime } from '@/hooks/use-realtime';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, SendHorizontal } from 'lucide-react';

export function RealtimeTest() {
  const { currentUser } = useUser();
  const { messages, isLoading, sendMessage } = useRealtime();
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim()) return;
    
    if (!currentUser) {
      toast({
        title: 'Not logged in',
        description: 'You need to be logged in to send messages',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      const success = await sendMessage(messageText);
      
      if (success) {
        setMessageText('');
        toast({
          title: 'Message sent',
          description: 'Your message has been sent successfully'
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send your message. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Realtime Testing</CardTitle>
        <CardDescription>
          Test realtime functionality by sending and receiving messages. All connected users will see messages instantly.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="h-[400px] overflow-y-auto border rounded-md p-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
            </div>
          ) : messages.length > 0 ? (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`p-3 rounded-lg ${
                  currentUser && msg.user_id === currentUser.id 
                    ? 'bg-primary/10 ml-auto max-w-[80%]' 
                    : 'bg-muted max-w-[80%]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium text-sm">{msg.user_name}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(msg.created_at)}</span>
                </div>
                <p className="mt-1">{msg.message}</p>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-full text-muted-foreground">
              No messages yet. Send one to get started!
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            disabled={!currentUser || isSending}
            className="flex-1"
          />
          <Button type="submit" disabled={!currentUser || isSending || !messageText.trim()}>
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <SendHorizontal className="h-4 w-4 mr-2" />
                Send
              </>
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
