
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Company } from '@/components/settings/types';

export function useCompanyDetails() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setCompany(data as Company);
    } catch (error) {
      console.error('Error fetching company details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load company details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveCompanyDetails = async (companyData: Company) => {
    try {
      setLoading(true);
      
      let operation;
      if (company?.id) {
        // Update existing record
        operation = await supabase
          .from('companies')
          .update(companyData)
          .eq('id', company.id);
      } else {
        // Insert new record
        operation = await supabase
          .from('companies')
          .insert(companyData);
      }

      const { error } = operation;
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Company details saved successfully',
      });
      
      fetchCompanyDetails();
    } catch (error) {
      console.error('Error saving company details:', error);
      toast({
        title: 'Error',
        description: 'Failed to save company details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    company,
    loading,
    fetchCompanyDetails,
    saveCompanyDetails,
  };
}
