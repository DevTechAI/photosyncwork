
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { FinanceCategory } from "@/hooks/finances/api/financeApi";

const formSchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
  type: z.enum(["income", "expense"], {
    required_error: "Please select a category type",
  }),
});

interface CategoryFormProps {
  onSubmit: (data: Omit<FinanceCategory, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  initialData?: FinanceCategory;
  onCancel: () => void;
}

export function CategoryForm({ onSubmit, initialData, onCancel }: CategoryFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || "expense",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Ensure values are not optional 
      const categoryData: Omit<FinanceCategory, 'id' | 'created_at' | 'updated_at'> = {
        name: values.name,
        type: values.type,
      };
      
      await onSubmit(categoryData);
      toast.success(`Category ${initialData ? "updated" : "created"} successfully`);
    } catch (error) {
      console.error("Error submitting category:", error);
      toast.error(`Failed to ${initialData ? "update" : "create"} category`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Update" : "Create"} Category
          </Button>
        </div>
      </form>
    </Form>
  );
}
