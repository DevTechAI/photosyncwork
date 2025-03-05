
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Vendor } from '@/components/settings/types';

export function useVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('name');

      if (error) throw error;
      setVendors(data as Vendor[]);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        title: 'Error',
        description: 'Failed to load vendors',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addVendor = async (vendor: Vendor) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('vendors')
        .insert(vendor);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Vendor added successfully',
      });
      
      fetchVendors();
    } catch (error) {
      console.error('Error adding vendor:', error);
      toast({
        title: 'Error',
        description: 'Failed to add vendor',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateVendor = async (vendor: Vendor) => {
    if (!vendor.id) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('vendors')
        .update(vendor)
        .eq('id', vendor.id);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Vendor updated successfully',
      });
      
      fetchVendors();
    } catch (error) {
      console.error('Error updating vendor:', error);
      toast({
        title: 'Error',
        description: 'Failed to update vendor',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteVendor = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Vendor deleted successfully',
      });
      
      fetchVendors();
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete vendor',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    vendors,
    loading,
    fetchVendors,
    addVendor,
    updateVendor,
    deleteVendor,
  };
}
