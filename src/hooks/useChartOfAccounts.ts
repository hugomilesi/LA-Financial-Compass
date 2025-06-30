
import { useState, useEffect } from 'react';
import { Account, AccountType } from '@/types/chartOfAccounts';

const STORAGE_KEY = 'la-music-chart-of-accounts';

const defaultAccounts: Account[] = [
  // RECEITAS (REVENUE)
  // Receitas Operacionais
  {
    id: 'rev-1',
    code: '3.1',
    name: 'Receitas Operacionais',
    type: 'revenue',
    isActive: true,
    level: 0,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-1.1',
    code: '3.1.1',
    name: 'Mensalidades',
    type: 'revenue',
    parentId: 'rev-1',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-1.1.1',
    code: '3.1.1.1',
    name: 'Mensalidades - Campo Grande',
    type: 'revenue',
    parentId: 'rev-1.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-1.1.2',
    code: '3.1.1.2',
    name: 'Mensalidades - Recreio',
    type: 'revenue',
    parentId: 'rev-1.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-1.2',
    code: '3.1.2',
    name: 'Taxas de Matrícula',
    type: 'revenue',
    parentId: 'rev-1',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-1.2.1',
    code: '3.1.2.1',
    name: 'Matrícula - Campo Grande',
    type: 'revenue',
    parentId: 'rev-1.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-1.2.2',
    code: '3.1.2.2',
    name: 'Matrícula - Recreio',
    type: 'revenue',
    parentId: 'rev-1.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-1.3',
    code: '3.1.3',
    name: 'Aulas Particulares',
    type: 'revenue',
    parentId: 'rev-1',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-1.3.1',
    code: '3.1.3.1',
    name: 'Aulas Particulares - Campo Grande',
    type: 'revenue',
    parentId: 'rev-1.3',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-1.3.2',
    code: '3.1.3.2',
    name: 'Aulas Particulares - Recreio',
    type: 'revenue',
    parentId: 'rev-1.3',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // DESPESAS (EXPENSES)
  // Custos Diretos
  {
    id: 'exp-1',
    code: '4.1',
    name: 'Custos Diretos',
    type: 'expense',
    isActive: true,
    level: 0,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-1.1',
    code: '4.1.1',
    name: 'Folha de Pagamento - Professores',
    type: 'expense',
    parentId: 'exp-1',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-1.1.1',
    code: '4.1.1.1',
    name: 'Salários - Professores',
    type: 'expense',
    parentId: 'exp-1.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-1.1.2',
    code: '4.1.1.2',
    name: 'Encargos Sociais - Professores',
    type: 'expense',
    parentId: 'exp-1.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-1.1.3',
    code: '4.1.1.3',
    name: 'FGTS - Professores',
    type: 'expense',
    parentId: 'exp-1.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-1.2',
    code: '4.1.2',
    name: 'Material de Ensino',
    type: 'expense',
    parentId: 'exp-1',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-1.2.1',
    code: '4.1.2.1',
    name: 'Instrumentos Musicais',
    type: 'expense',
    parentId: 'exp-1.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-1.2.2',
    code: '4.1.2.2',
    name: 'Partituras e Métodos',
    type: 'expense',
    parentId: 'exp-1.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Despesas Administrativas
  {
    id: 'exp-2',
    code: '4.2',
    name: 'Despesas Administrativas',
    type: 'expense',
    isActive: true,
    level: 0,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-2.1',
    code: '4.2.1',
    name: 'Folha Administrativa',
    type: 'expense',
    parentId: 'exp-2',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-2.1.1',
    code: '4.2.1.1',
    name: 'Salário - Coordenação',
    type: 'expense',
    parentId: 'exp-2.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-2.1.2',
    code: '4.2.1.2',
    name: 'Salário - Secretaria',
    type: 'expense',
    parentId: 'exp-2.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-2.1.3',
    code: '4.2.1.3',
    name: 'Encargos Sociais - Administrativo',
    type: 'expense',
    parentId: 'exp-2.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-2.2',
    code: '4.2.2',
    name: 'Aluguel e Condomínio',
    type: 'expense',
    parentId: 'exp-2',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-2.2.1',
    code: '4.2.2.1',
    name: 'Aluguel - Campo Grande',
    type: 'expense',
    parentId: 'exp-2.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-2.2.2',
    code: '4.2.2.2',
    name: 'Aluguel - Recreio',
    type: 'expense',
    parentId: 'exp-2.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-2.2.3',
    code: '4.2.2.3',
    name: 'Condomínio - Campo Grande',
    type: 'expense',
    parentId: 'exp-2.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-2.2.4',
    code: '4.2.2.4',
    name: 'Condomínio - Recreio',
    type: 'expense',
    parentId: 'exp-2.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-2.3',
    code: '4.2.3',
    name: 'Utilities',
    type: 'expense',
    parentId: 'exp-2',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-2.3.1',
    code: '4.2.3.1',
    name: 'Energia Elétrica',
    type: 'expense',
    parentId: 'exp-2.3',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-2.3.2',
    code: '4.2.3.2',
    name: 'Água e Esgoto',
    type: 'expense',
    parentId: 'exp-2.3',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-2.3.3',
    code: '4.2.3.3',
    name: 'Internet e Telefone',
    type: 'expense',
    parentId: 'exp-2.3',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-2.4',
    code: '4.2.4',
    name: 'Marketing e Publicidade',
    type: 'expense',
    parentId: 'exp-2',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-2.4.1',
    code: '4.2.4.1',
    name: 'Publicidade Online',
    type: 'expense',
    parentId: 'exp-2.4',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-2.4.2',
    code: '4.2.4.2',
    name: 'Material Gráfico',
    type: 'expense',
    parentId: 'exp-2.4',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-2.5',
    code: '4.2.5',
    name: 'Despesas Gerais',
    type: 'expense',
    parentId: 'exp-2',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-2.5.1',
    code: '4.2.5.1',
    name: 'Material de Escritório',
    type: 'expense',
    parentId: 'exp-2.5',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-2.5.2',
    code: '4.2.5.2',
    name: 'Limpeza e Conservação',
    type: 'expense',
    parentId: 'exp-2.5',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-2.5.3',
    code: '4.2.5.3',
    name: 'Seguros',
    type: 'expense',
    parentId: 'exp-2.5',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // INVESTIMENTOS (ASSETS)
  {
    id: 'inv-1',
    code: '1.1',
    name: 'Ativo Circulante',
    type: 'asset',
    isActive: true,
    level: 0,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'inv-1.1',
    code: '1.1.1',
    name: 'Caixa e Equivalentes',
    type: 'asset',
    parentId: 'inv-1',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'inv-1.1.1',
    code: '1.1.1.1',
    name: 'Caixa',
    type: 'asset',
    parentId: 'inv-1.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'inv-1.1.2',
    code: '1.1.1.2',
    name: 'Conta Corrente - Banco do Brasil',
    type: 'asset',
    parentId: 'inv-1.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'inv-1.1.3',
    code: '1.1.1.3',
    name: 'Conta Corrente - Itaú',
    type: 'asset',
    parentId: 'inv-1.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'inv-1.2',
    code: '1.1.2',
    name: 'Contas a Receber',
    type: 'asset',
    parentId: 'inv-1',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'inv-1.2.1',
    code: '1.1.2.1',
    name: 'Mensalidades a Receber',
    type: 'asset',
    parentId: 'inv-1.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'inv-1.2.2',
    code: '1.1.2.2',
    name: 'Matrículas a Receber',
    type: 'asset',
    parentId: 'inv-1.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'inv-2',
    code: '1.2',
    name: 'Ativo Não Circulante',
    type: 'asset',
    isActive: true,
    level: 0,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'inv-2.1',
    code: '1.2.1',
    name: 'Imobilizado',
    type: 'asset',
    parentId: 'inv-2',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'inv-2.1.1',
    code: '1.2.1.1',
    name: 'Instrumentos Musicais',
    type: 'asset',
    parentId: 'inv-2.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'inv-2.1.2',
    code: '1.2.1.2',
    name: 'Equipamentos de Som',
    type: 'asset',
    parentId: 'inv-2.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'inv-2.1.3',
    code: '1.2.1.3',
    name: 'Móveis e Utensílios',
    type: 'asset',
    parentId: 'inv-2.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // RECEITAS NÃO OPERACIONAIS (REVENUE)
  {
    id: 'rev-2',
    code: '3.2',
    name: 'Receitas Não Operacionais',
    type: 'revenue',
    isActive: true,
    level: 0,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-2.1',
    code: '3.2.1',
    name: 'Receitas Financeiras',
    type: 'revenue',
    parentId: 'rev-2',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-2.1.1',
    code: '3.2.1.1',
    name: 'Juros de Aplicações',
    type: 'revenue',
    parentId: 'rev-2.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-2.1.2',
    code: '3.2.1.2',
    name: 'Descontos Obtidos',
    type: 'revenue',
    parentId: 'rev-2.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // DESPESAS NÃO OPERACIONAIS (EXPENSES)
  {
    id: 'exp-3',
    code: '4.3',
    name: 'Despesas Não Operacionais',
    type: 'expense',
    isActive: true,
    level: 0,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-3.1',
    code: '4.3.1',
    name: 'Despesas Financeiras',
    type: 'expense',
    parentId: 'exp-3',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-3.1.1',
    code: '4.3.1.1',
    name: 'Juros e Multas',
    type: 'expense',
    parentId: 'exp-3.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-3.1.2',
    code: '4.3.1.2',
    name: 'Tarifas Bancárias',
    type: 'expense',
    parentId: 'exp-3.1',
    isActive: true,
    level: 2,
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
          status: account.status || 'active',
          priority: account.priority || 0,
          tags: account.tags || [],
          notes: account.notes || '',
          createdAt: new Date(account.createdAt),
          updatedAt: new Date(account.updatedAt),
          lastUsed: account.lastUsed ? new Date(account.lastUsed) : undefined
        })));
      } catch (error) {
        console.error('Error parsing stored accounts:', error);
        setAccounts(defaultAccounts.map(acc => ({
          ...acc,
          status: 'active',
          priority: 0,
          tags: [],
          notes: ''
        })));
      }
    } else {
      setAccounts(defaultAccounts.map(acc => ({
        ...acc,
        status: 'active',
        priority: 0,
        tags: [],
        notes: ''
      })));
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
      status: accountData.status || 'active',
      priority: accountData.priority || 0,
      tags: accountData.tags || [],
      notes: accountData.notes || '',
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

  const updateAccountNotes = (id: string, notes: string) => {
    updateAccount(id, { notes });
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

  const reorderAccounts = (accountIds: string[]) => {
    const reorderedAccounts = accountIds.map((id, index) => {
      const account = accounts.find(acc => acc.id === id);
      return account ? { ...account, priority: index } : null;
    }).filter(Boolean) as Account[];
    
    const otherAccounts = accounts.filter(acc => !accountIds.includes(acc.id));
    saveToStorage([...reorderedAccounts, ...otherAccounts]);
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
    updateAccountNotes,
    deleteAccount,
    reorderAccounts,
    getChildAccounts,
    getAccountPath
  };
};
