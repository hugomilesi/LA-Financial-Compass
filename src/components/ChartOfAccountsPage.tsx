
import { useState } from 'react';
import { Account } from '@/types/chartOfAccounts';
import { useChartOfAccounts } from '@/hooks/useChartOfAccounts';
import { ChartOfAccountsHeader } from '@/components/chartOfAccounts/ChartOfAccountsHeader';
import { ChartOfAccountsFilters } from '@/components/chartOfAccounts/ChartOfAccountsFilters';
import { ChartOfAccountsContent } from '@/components/chartOfAccounts/ChartOfAccountsContent';

export const ChartOfAccountsPage = () => {
  const { accounts, addAccount, updateAccount, deleteAccount } = useChartOfAccounts();
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('all');

  const toggleExpanded = (accountId: string) => {
    const newExpanded = new Set(expandedAccounts);
    if (newExpanded.has(accountId)) {
      newExpanded.delete(accountId);
    } else {
      newExpanded.add(accountId);
    }
    setExpandedAccounts(newExpanded);
  };

  const handleSaveAccount = (accountData: Omit<Account, 'id'>) => {
    if (editingAccount) {
      updateAccount(editingAccount.id, accountData);
      setEditingAccount(null);
    } else {
      addAccount(accountData);
      setShowAddForm(false);
    }
  };

  const handleCancelForm = () => {
    setEditingAccount(null);
    setShowAddForm(false);
  };

  const filterAccountsByUnit = (accounts: Account[]) => {
    if (selectedUnit === 'all') return accounts;
    
    return accounts.filter(account => {
      // Filter based on account name containing unit identifier
      const accountName = account.name.toLowerCase();
      if (selectedUnit === 'campo-grande') {
        return accountName.includes('campo grande') || accountName.includes('campo-grande');
      }
      if (selectedUnit === 'recreio') {
        return accountName.includes('recreio');
      }
      if (selectedUnit === 'barra') {
        return accountName.includes('barra');
      }
      return true;
    });
  };

  const filteredAccounts = filterAccountsByUnit(
    accounts.filter(account => 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.code.includes(searchTerm)
    )
  );

  return (
    <div className="p-6 space-y-6">
      <ChartOfAccountsHeader onAddAccount={() => setShowAddForm(true)} />
      
      <ChartOfAccountsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedUnit={selectedUnit}
        onUnitChange={setSelectedUnit}
        accountCount={filteredAccounts.length}
      />

      <ChartOfAccountsContent
        accounts={accounts}
        filteredAccounts={filteredAccounts}
        expandedAccounts={expandedAccounts}
        editingAccount={editingAccount}
        showAddForm={showAddForm}
        searchTerm={searchTerm}
        selectedUnit={selectedUnit}
        onToggleExpanded={toggleExpanded}
        onEdit={setEditingAccount}
        onDelete={deleteAccount}
        onSaveAccount={handleSaveAccount}
        onCancelForm={handleCancelForm}
      />
    </div>
  );
};
