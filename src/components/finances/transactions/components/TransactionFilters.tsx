
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FinanceCategory } from "@/hooks/finances/api/financeApi";

interface TransactionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterTypeChange: (value: string) => void;
  filterCategory: string;
  onFilterCategoryChange: (value: string) => void;
  categories: FinanceCategory[];
}

export function TransactionFilters({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  filterCategory,
  onFilterCategoryChange,
  categories,
}: TransactionFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search transactions..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Select 
          value={filterType} 
          onValueChange={onFilterTypeChange}
        >
          <SelectTrigger className="w-[150px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filterCategory} 
          onValueChange={onFilterCategoryChange}
        >
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
