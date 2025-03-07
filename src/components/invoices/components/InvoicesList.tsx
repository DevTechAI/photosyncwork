
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Receipt, ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InvoicesListProps {
  invoices: any[];
  sortBy: "date" | "amount";
  setSortBy: (sortBy: "date" | "amount") => void;
  onViewDetails: (invoice: any) => void;
}

export function InvoicesList({
  invoices,
  sortBy,
  setSortBy,
  onViewDetails,
}: InvoicesListProps) {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Invoices</h2>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => setSortBy(sortBy === "date" ? "amount" : "date")}
          >
            <ArrowUpDown className="h-4 w-4" />
            Sort by {sortBy === "date" ? "Amount" : "Date"}
          </Button>
        </div>
        <div className="divide-y">
          {invoices.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No invoices found</p>
            </div>
          ) : (
            invoices.map((invoice: any) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center">
                    <Receipt className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{invoice.client}</p>
                    <p className="text-sm text-muted-foreground">
                      {invoice.id} · {invoice.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{invoice.amount}</p>
                    <p className="text-sm text-muted-foreground">
                      {invoice.status}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails(invoice)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit Invoice</DropdownMenuItem>
                      <DropdownMenuItem>Download PDF</DropdownMenuItem>
                      <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}
