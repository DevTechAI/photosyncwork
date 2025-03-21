
export interface FinanceCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  created_at?: string;
  updated_at?: string;
}

export interface FinanceSubcategory {
  id: string;
  category_id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface FinanceTransaction {
  id: string;
  category_id: string;
  subcategory_id?: string;
  amount: number;
  transaction_date: string;
  description?: string;
  transaction_type: 'income' | 'expense';
  payment_method?: string;
  source_id?: string; // Reference ID (invoice ID, vendor payment ID)
  source_type?: string; // Type of source (invoice, vendor, general)
  metadata?: {
    client_name?: string;
    invoice_id?: string;
    [key: string]: any;
  };
  created_at?: string;
  updated_at?: string;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  incomeByCategory: { category: string; amount: number }[];
  expenseByCategory: { category: string; amount: number }[];
}

export interface TransactionSource {
  id: string;
  type: 'invoice' | 'vendor' | 'general';
  reference: string; // Additional reference information
}
