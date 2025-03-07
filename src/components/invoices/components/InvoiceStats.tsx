
import { Card } from "@/components/ui/card";

export function InvoiceStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6">
        <p className="text-sm font-medium text-muted-foreground">
          Total Outstanding
        </p>
        <h3 className="text-2xl font-semibold mt-2">₹0</h3>
      </Card>
      <Card className="p-6">
        <p className="text-sm font-medium text-muted-foreground">
          Paid this Month
        </p>
        <h3 className="text-2xl font-semibold mt-2">₹0</h3>
      </Card>
      <Card className="p-6">
        <p className="text-sm font-medium text-muted-foreground">
          Draft Invoices
        </p>
        <h3 className="text-2xl font-semibold mt-2">₹0</h3>
      </Card>
    </div>
  );
}
