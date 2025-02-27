
import { Button } from "@/components/ui/button";
import { Mail, Share2, ThumbsUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HeaderActionsProps {
  onShowEmailForm: () => void;
  onShowWhatsAppForm: () => void;
  onShowApprovalForm: () => void;
  isApproved: boolean;
}

export function HeaderActions({ 
  onShowEmailForm, 
  onShowWhatsAppForm, 
  onShowApprovalForm,
  isApproved 
}: HeaderActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={onShowEmailForm}
            >
              <Mail className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Send via Email</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={onShowWhatsAppForm}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share via WhatsApp</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={onShowApprovalForm}
              className={isApproved ? "bg-green-100 text-green-700" : ""}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Client Approval</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
