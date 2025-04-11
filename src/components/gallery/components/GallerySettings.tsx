
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface GallerySettingsProps {
  eventName: string;
  clientName: string;
}

export function GallerySettings({ eventName, clientName }: GallerySettingsProps) {
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
              <span className="truncate">https://studioclient.com/g/abc123</span>
              <Button variant="ghost" size="sm">Copy</Button>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <Button className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Upload More Photos
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
