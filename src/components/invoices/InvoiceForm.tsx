
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

interface InvoiceFormProps {
  open: boolean;
  onClose: () => void;
}

export function InvoiceForm({ open, onClose }: InvoiceFormProps) {
  const [items, setItems] = useState([{ description: "", amount: "" }]);
  const [gstRate, setGstRate] = useState("18");
  const [invoiceType, setInvoiceType] = useState<"proforma" | "paid">("proforma");

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
        <form className="space-y-6">
          <ClientDetailsCard 
            invoiceType={invoiceType}
            onInvoiceTypeChange={setInvoiceType}
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
