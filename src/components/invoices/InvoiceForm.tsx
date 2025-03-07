
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { ClientDetailsCard } from "./components/ClientDetailsCard";
import { InvoiceItemsCard } from "./components/InvoiceItemsCard";
import { TotalCard } from "./components/TotalCard";
import { toast } from "sonner";

interface InvoiceFormProps {
  open: boolean;
  onClose: () => void;
}

export function InvoiceForm({ open, onClose }: InvoiceFormProps) {
  const [items, setItems] = useState([{ description: "", amount: "" }]);
  const [gstRate, setGstRate] = useState("18");
  const [invoiceType, setInvoiceType] = useState<"proforma" | "paid">("proforma");
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("bank");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Validation
    if (items.some(item => !item.description || !item.amount)) {
      toast.error("Please fill in all invoice items");
      return;
    }
    
    if (invoiceType === "paid" && !paymentReceived) {
      toast.warning("This is a paid invoice but payment is not marked as received");
    }
    
    // In a real app, we would save the invoice to the database here
    toast.success(`${invoiceType === "proforma" ? "Proforma" : "Paid"} invoice created successfully`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Create New {invoiceType === "proforma" ? "Proforma" : "Paid"} Invoice
          </DialogTitle>
          <DialogDescription>
            Create a new {invoiceType.toLowerCase()} invoice for your photography services.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <ClientDetailsCard 
            invoiceType={invoiceType}
            onInvoiceTypeChange={setInvoiceType}
            paymentReceived={paymentReceived}
            onPaymentReceivedChange={setPaymentReceived}
            paymentDate={paymentDate}
            onPaymentDateChange={setPaymentDate}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
          />
          <InvoiceItemsCard items={items} onItemsChange={setItems} />
          {invoiceType === "paid" ? (
            <TotalCard
              items={items}
              gstRate={gstRate}
              onGstRateChange={setGstRate}
            />
          ) : (
            <TotalCard
              items={items}
              gstRate="0"
              onGstRateChange={() => {}}
              hideGst
            />
          )}
          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create {invoiceType === "proforma" ? "Proforma" : "Paid"} Invoice
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
