
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScheduledEvent } from "@/components/scheduling/types";
import { UserPlus, Copy } from "lucide-react";

interface CreateClientAccessProps {
  selectedEvent: ScheduledEvent;
  onAccessCreated: () => void;
}

export function CreateClientAccess({ selectedEvent, onAccessCreated }: CreateClientAccessProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdAccessCode, setCreatedAccessCode] = useState<string>("");
  const { toast } = useToast();

  const generateAccessCode = (clientName: string, eventId: string) => {
    // Create a simple hash based on client name and event ID
    let hash = 0;
    const input = `${clientName}${eventId}`.toLowerCase();
    
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to positive 4-digit number
    const code = Math.abs(hash % 9000) + 1000;
    return code.toString();
  };

  const handleCreateAccess = async () => {
    setLoading(true);
    try {
      const accessCode = generateAccessCode(selectedEvent.clientName, selectedEvent.id);
      
      // Check if access code already exists for this event
      const { data: existingAccess } = await supabase
        .from('client_portal_access')
        .select('access_code')
        .eq('event_id', selectedEvent.id)
        .eq('is_active', true)
        .single();

      if (existingAccess) {
        setCreatedAccessCode(existingAccess.access_code);
        toast({
          title: "Access code already exists",
          description: "Using existing access code for this client."
        });
      } else {
        const { error } = await supabase
          .from('client_portal_access')
          .insert({
            event_id: selectedEvent.id,
            access_code: accessCode,
            client_name: selectedEvent.clientName,
            client_email: selectedEvent.clientEmail,
            expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
            is_active: true
          });

        if (error) throw error;

        setCreatedAccessCode(accessCode);
        toast({
          title: "Client access created",
          description: "4-digit access code has been generated successfully."
        });
      }

      onAccessCreated();

    } catch (error: any) {
      console.error('Error creating client access:', error);
      toast({
        title: "Error",
        description: "Failed to create client access. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyAccessCode = () => {
    navigator.clipboard.writeText(createdAccessCode);
    toast({
      title: "Copied!",
      description: "Access code copied to clipboard."
    });
  };

  const resetDialog = () => {
    setCreatedAccessCode("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Create Client Access
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Client Portal Access</DialogTitle>
        </DialogHeader>
        
        {!createdAccessCode ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Event</Label>
              <Input value={selectedEvent.name} disabled />
            </div>
            
            <div className="space-y-2">
              <Label>Client Name</Label>
              <Input value={selectedEvent.clientName} disabled />
            </div>
            
            <div className="space-y-2">
              <Label>Client Email</Label>
              <Input value={selectedEvent.clientEmail || "Not provided"} disabled />
            </div>
            
            <div className="space-y-2">
              <Label>Access Details</Label>
              <Textarea 
                value="• 4-digit static access code&#10;• Access expires in 90 days&#10;• Client can view and download images&#10;• Client can provide feedback&#10;• Download tracking enabled"
                disabled
                rows={5}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={resetDialog} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleCreateAccess} disabled={loading} className="flex-1">
                {loading ? "Creating..." : "Create Access"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-900 mb-2">Access Code Created!</h3>
              <div className="space-y-2">
                <div className="font-mono text-3xl font-bold bg-white p-4 rounded border">
                  {createdAccessCode}
                </div>
                <Button 
                  onClick={copyAccessCode}
                  variant="outline" 
                  size="sm"
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy Code
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Share this 4-digit code with your client</p>
              <p>• Client can access at: /client-portal</p>
              <p>• Access expires in 90 days</p>
              <p>• This code is unique to this client and event</p>
              <p>• You can manage deliverables in the Production tab</p>
            </div>
            
            <Button onClick={resetDialog} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
