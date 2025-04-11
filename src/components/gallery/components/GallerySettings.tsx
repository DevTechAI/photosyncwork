
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Upload, ExternalLink } from "lucide-react";
import { useToast } from '@/components/ui/use-toast';

interface GallerySettingsProps {
  eventName: string;
  clientName: string;
  galleryId?: string;
}

export function GallerySettings({ eventName, clientName, galleryId }: GallerySettingsProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  
  // Generate a gallery URL - in a real app this would be a proper URL
  const galleryUrl = `https://studioclient.com/g/${galleryId || 'demo'}`;
  
  // Handle copy link button
  const handleCopyLink = () => {
    navigator.clipboard.writeText(galleryUrl)
      .then(() => {
        setIsCopied(true);
        toast({
          title: "Link Copied",
          description: "Gallery link copied to clipboard"
        });
        
        // Reset the copied state after 2 seconds
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        toast({
          title: "Copy Failed",
          description: "Failed to copy link to clipboard",
          variant: "destructive"
        });
      });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gallery Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Event Information</h3>
            <p className="text-sm text-muted-foreground">{eventName}</p>
            <p className="text-sm text-muted-foreground">Client: {clientName}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1">Gallery Status</h3>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">Active</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1">Gallery Access</h3>
            <div className="flex items-center justify-between border rounded p-2 text-sm">
              <span className="truncate">{galleryUrl}</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleCopyLink}
                className={isCopied ? "text-green-500" : ""}
              >
                {isCopied ? "Copied" : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="pt-4 border-t space-y-2">
            <Button className="w-full" variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload More Photos
            </Button>
            
            <Button className="w-full" variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Client View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
