
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

  const generateAccessCode = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleCreateAccess = async () => {
    setLoading(true);
    try {
      const accessCode = generateAccessCode();
      
      const { error } = await supabase
        .from('client_portal_access')
        .insert({
          event_id: selectedEvent.id,
          access_code: accessCode,
          client_name: selectedEvent.clientName,
          client_email: selectedEvent.clientEmail,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          is_active: true
        });

      if (error) throw error;

      setCreatedAccessCode(accessCode);
      onAccessCreated();
      
      toast({
        title: "Client access created",
        description: "Access code has been generated successfully."
      });

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
                value="• Access expires in 30 days&#10;• Client can view approved deliverables&#10;• Client can provide feedback&#10;• Download tracking enabled"
                disabled
                rows={4}
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
                <div className="font-mono text-lg bg-white p-3 rounded border">
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
              <p>• Share this code with your client</p>
              <p>• Client can access at: /client-portal</p>
              <p>• Access expires in 30 days</p>
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
