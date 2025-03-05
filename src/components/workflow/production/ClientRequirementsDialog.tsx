
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface ClientRequirementsDialogProps {
  isOpen: boolean; // Changed from 'open' to 'isOpen'
  onClose: () => void;
  requirements: string;
  references: string[];
}

export function ClientRequirementsDialog({ 
  isOpen, // Using isOpen instead of open
  onClose, 
  requirements, 
  references 
}: ClientRequirementsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Client Requirements & References</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Requirements</h3>
            <div className="border rounded-md bg-muted/20 p-4 whitespace-pre-wrap">
              {requirements || "No specific requirements have been provided."}
            </div>
          </div>
          
          {references && references.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium mb-2">Reference Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {references.map((image, index) => (
                    <div key={index} className="aspect-square border rounded-md overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Reference ${index + 1}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/300x300/f3f4f6/a1a1aa?text=Image+Unavailable';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
