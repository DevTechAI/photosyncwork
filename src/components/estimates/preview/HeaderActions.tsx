
import { Button } from "@/components/ui/button";
import { Mail, Share2, FileText } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface HeaderActionsProps {
  onShowEmailForm: () => void;
  onShowWhatsAppForm: () => void;
  onShowApprovalForm: () => void;
  isApproved: boolean;
  onCreateInvoice?: () => void;
}

export function HeaderActions({ 
  onShowEmailForm, 
  onShowWhatsAppForm, 
  onShowApprovalForm,
  isApproved,
  onCreateInvoice
}: HeaderActionsProps) {
  return (
    <div className="flex gap-2">
      {!isApproved && (
        <Button onClick={onShowApprovalForm} variant="secondary">
          Approve
        </Button>
      )}
      
      <Button onClick={onShowEmailForm} variant="outline" size="icon">
        <Mail className="h-4 w-4" />
      </Button>
      
      <Button onClick={onShowWhatsAppForm} variant="outline" size="icon">
        <Share2 className="h-4 w-4" />
      </Button>
      
      {isApproved && onCreateInvoice && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Next Steps</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onCreateInvoice}>
              <FileText className="h-4 w-4 mr-2" />
              Create Invoice
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
