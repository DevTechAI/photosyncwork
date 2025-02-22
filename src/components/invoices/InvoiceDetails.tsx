
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Send } from "lucide-react";

interface InvoiceDetailsProps {
  invoice: {
    id: string;
    client: string;
    date: string;
    amount: string;
    status: string;
  } | null;
  open: boolean;
  onClose: () => void;
}

export function InvoiceDetails({ invoice, open, onClose }: InvoiceDetailsProps) {
  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Invoice {invoice.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Client</p>
              <p className="font-medium mt-1">{invoice.client}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium mt-1">{invoice.date}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-medium mt-1">{invoice.amount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium mt-1">{invoice.status}</p>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button className="gap-2">
              <Send className="h-4 w-4" />
              Send to Client
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
