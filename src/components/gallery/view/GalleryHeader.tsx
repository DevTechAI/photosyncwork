
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";

interface GalleryHeaderProps {
  eventName: string;
  clientName: string;
}

export function GalleryHeader({ eventName, clientName }: GalleryHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">{eventName}</h1>
        <p className="text-muted-foreground">Client: {clientName}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share Gallery
        </Button>
        <Button variant="default" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download Selected
        </Button>
      </div>
    </div>
  );
}
