
export interface InvoiceItem {
  description: string;
  amount: string;
}

export interface Invoice {
  id: string;
  client: string;
  clientEmail?: string;
  date: string;
  amount: string;
  paidAmount: string;
  balanceAmount: string;
  status: "pending" | "partial" | "paid";
  items: InvoiceItem[];
  estimateId?: string;
  notes?: string;
  paymentDate?: string;
  paymentMethod?: string;
  gstRate?: string;
}
