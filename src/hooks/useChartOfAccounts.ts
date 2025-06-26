
import { useState, useEffect } from 'react';
import { Account, AccountType } from '@/types/chartOfAccounts';

const STORAGE_KEY = 'la-music-chart-of-accounts';

const defaultAccounts: Account[] = [
  // Revenue Accounts
  {
    id: '1.1',
    code: '3.1.01',
    name: 'Receita de Mensalidades',
    type: 'revenue',
    isActive: true,
    level: 0,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '1.1.1',
    code: '3.1.01.01',
    name: 'Mensalidades - Unidade Campo Grande',
    type: 'revenue',
    parentId: '1.1',
    isActive: true,
    level: 1,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '1.1.2',
    code: '3.1.01.02',
    name: 'Mensalidades - Unidade Recreio',
    type: 'revenue',
    parentId: '1.1',
    isActive: true,
    level: 1,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '1.2',
    code: '3.1.02',
    name: 'Receita de Matrículas',
    type: 'revenue',
    isActive: true,
    level: 0,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Expense Accounts
  {
    id: '2.1',
    code: '4.1.01',
    name: 'Despesas com Pessoal',
    type: 'expense',
    isActive: true,
    level: 0,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2.1.1',
    code: '4.1.01.01',
    name: 'Salários de Professores',
    type: 'expense',
    parentId: '2.1',
    isActive: true,
    level: 1,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2.2',
    code: '4.1.02',
    name: 'Despesas Administrativas',
    type: 'expense',
    isActive: true,
    level: 0,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2.2.1',
    code: '4.1.02.01',
    name: 'Aluguel',
    type: 'expense',
    parentId: '2.2',
    isActive: true,
    level: 1,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const useChartOfAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const storedAccounts = localStorage.getItem(STORAGE_KEY);
    if (storedAccounts) {
      try {
        const parsed = JSON.parse(storedAccounts);
        setAccounts(parsed.map((account: any) => ({
          ...account,
          createdAt: new Date(account.createdAt),
          updatedAt: new Date(account.updatedAt)
        })));
      } catch (error) {
        console.error('Error parsing stored accounts:', error);
        setAccounts(defaultAccounts);
      }
    } else {
      setAccounts(defaultAccounts);
    }
  }, []);

  const saveToStorage = (updatedAccounts: Account[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAccounts));
    setAccounts(updatedAccounts);
  };

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const addAccount = (accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAccount: Account = {
      ...accountData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedAccounts = [...accounts, newAccount];
    
    // Update parent hasChildren if needed
    if (newAccount.parentId) {
      const parentIndex = updatedAccounts.findIndex(acc => acc.id === newAccount.parentId);
      if (parentIndex !== -1) {
        updatedAccounts[parentIndex].hasChildren = true;
      }
    }

    saveToStorage(updatedAccounts);
  };

  const updateAccount = (id: string, accountData: Partial<Omit<Account, 'id' | 'createdAt'>>) => {
    const updatedAccounts = accounts.map(account => 
      account.id === id 
        ? { ...account, ...accountData, updatedAt: new Date() }
        : account
    );
    saveToStorage(updatedAccounts);
  };

  const deleteAccount = (id: string) => {
    const accountToDelete = accounts.find(acc => acc.id === id);
    if (!accountToDelete) return;

    // Check if account has children
    const hasChildren = accounts.some(acc => acc.parentId === id);
    if (hasChildren) {
      alert('Não é possível excluir uma conta que possui subcontas. Exclua primeiro as subcontas.');
      return;
    }

    const updatedAccounts = accounts.filter(account => account.id !== id);
    
    // Update parent hasChildren if this was the last child
    if (accountToDelete.parentId) {
      const siblingsCount = accounts.filter(acc => 
        acc.parentId === accountToDelete.parentId && acc.id !== id
      ).length;
      
      if (siblingsCount === 0) {
        const parentIndex = updatedAccounts.findIndex(acc => acc.id === accountToDelete.parentId);
        if (parentIndex !== -1) {
          updatedAccounts[parentIndex].hasChildren = false;
        }
      }
    }

    saveToStorage(updatedAccounts);
  };

  const getChildAccounts = (parentId: string) => {
    return accounts.filter(account => account.parentId === parentId);
  };

  const getAccountPath = (accountId: string): Account[] => {
    const path: Account[] = [];
    let currentAccount = accounts.find(acc => acc.id === accountId);
    
    while (currentAccount) {
      path.unshift(currentAccount);
      currentAccount = currentAccount.parentId 
        ? accounts.find(acc => acc.id === currentAccount!.parentId)
        : undefined;
    }
    
    return path;
  };

  return {
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
    getChildAccounts,
    getAccountPath
  };
};
