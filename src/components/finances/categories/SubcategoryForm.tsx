
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
import { FinanceCategory, FinanceSubcategory } from "@/hooks/finances/api/financeApi";

const formSchema = z.object({
  name: z.string().min(1, { message: "Subcategory name is required" }),
  category_id: z.string().min(1, { message: "Please select a parent category" }),
});

interface SubcategoryFormProps {
  onSubmit: (data: Omit<FinanceSubcategory, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  initialData?: FinanceSubcategory;
  categories: FinanceCategory[];
  categoryType: 'income' | 'expense'; // Added categoryType prop
  onCancel: () => void;
}

export function SubcategoryForm({ onSubmit, initialData, categories, categoryType, onCancel }: SubcategoryFormProps) {
  // Filter categories by type
  const filteredCategories = categories.filter(category => category.type === categoryType);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      category_id: initialData?.category_id || "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Ensure all required fields are provided
      const subcategoryData: Omit<FinanceSubcategory, 'id' | 'created_at' | 'updated_at'> = {
        name: values.name,
        category_id: values.category_id
      };
      
      await onSubmit(subcategoryData);
      toast.success(`Subcategory ${initialData ? "updated" : "created"} successfully`);
    } catch (error) {
      console.error("Error submitting subcategory:", error);
      toast.error(`Failed to ${initialData ? "update" : "create"} subcategory`);
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
              <FormLabel>Subcategory Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter subcategory name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
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
            {initialData ? "Update" : "Create"} Subcategory
          </Button>
        </div>
      </form>
    </Form>
  );
}
