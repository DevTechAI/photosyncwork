
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { ClientDetailsCard } from "../invoices/components/ClientDetailsCard";
import { InvoiceItemsCard } from "../invoices/components/InvoiceItemsCard";
import { TotalCard } from "../invoices/components/TotalCard";

interface EstimateFormProps {
  open: boolean;
  onClose: () => void;
}

export function EstimateForm({ open, onClose }: EstimateFormProps) {
  const [items, setItems] = useState([{ description: "", amount: "" }]);
  const [gstRate, setGstRate] = useState("18");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Estimate</DialogTitle>
          <DialogDescription>
            Create a new estimate for your photography services.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-6">
          <ClientDetailsCard />
          <InvoiceItemsCard items={items} onItemsChange={setItems} />
          <TotalCard
            items={items}
            gstRate={gstRate}
            onGstRateChange={setGstRate}
          />
          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Estimate</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
