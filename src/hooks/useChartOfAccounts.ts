import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Account } from '@/types/chartOfAccounts';

interface UseChartOfAccountsResult {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  fetchAccounts: () => Promise<void>;
  addAccount: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAccount: (id: string, updates: Partial<Account>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
}

export function useChartOfAccounts(): UseChartOfAccountsResult {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('chart_of_accounts')
      .select('*')
      .order('code', { ascending: true });
    if (error) {
      setError(error.message);
    } else {
      setAccounts(data || []);
    }
    setLoading(false);
  }, []);

  const addAccount = useCallback(async (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase
      .from('chart_of_accounts')
      .insert([{
        ...account,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]);
    if (error) setError(error.message);
    await fetchAccounts();
    setLoading(false);
  }, [fetchAccounts]);

  const updateAccount = useCallback(async (id: string, updates: Partial<Account>) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase
      .from('chart_of_accounts')
      .update({ ...updates, updatedAt: new Date().toISOString() })
      .eq('id', id);
    if (error) setError(error.message);
    await fetchAccounts();
    setLoading(false);
  }, [fetchAccounts]);

  const deleteAccount = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase
      .from('chart_of_accounts')
      .delete()
      .eq('id', id);
    if (error) setError(error.message);
    await fetchAccounts();
    setLoading(false);
  }, [fetchAccounts]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
  };
}


