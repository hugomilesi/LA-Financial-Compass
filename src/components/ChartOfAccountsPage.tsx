
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronDown, Plus, Edit, Save, X, BookOpen } from 'lucide-react';
import { Account, AccountType } from '@/types/chartOfAccounts';
import { useChartOfAccounts } from '@/hooks/useChartOfAccounts';
import { AccountForm } from '@/components/chartOfAccounts/AccountForm';
import { AccountTreeItem } from '@/components/chartOfAccounts/AccountTreeItem';
import { UnitFilter } from '@/components/chartOfAccounts/UnitFilter';

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

  const getAccountsByType = (type: AccountType) => {
    return filteredAccounts.filter(account => account.type === type && !account.parentId);
  };

  const accountTypes: { type: AccountType; label: string; description: string }[] = [
    { type: 'revenue', label: 'Receitas', description: 'Contas de receita e faturamento' },
    { type: 'expense', label: 'Despesas', description: 'Contas de custos e despesas' },
    { type: 'asset', label: 'Ativo', description: 'Bens e direitos' },
    { type: 'liability', label: 'Passivo', description: 'Obrigações e dívidas' },
    { type: 'equity', label: 'Patrimônio Líquido', description: 'Capital e reservas' }
  ];

  const getUnitDisplayName = () => {
    switch (selectedUnit) {
      case 'campo-grande': return 'Campo Grande';
      case 'recreio': return 'Recreio';
      case 'barra': return 'Barra';
      default: return 'Todas as Unidades';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Plano de Contas</h1>
            <p className="text-gray-600">Gerencie a estrutura contábil da LA Music</p>
          </div>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Conta
        </Button>
      </div>

      <div className="flex gap-6 items-start">
        <div className="flex gap-4 items-center flex-1">
          <Input
            placeholder="Buscar contas por nome ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <Badge variant="outline" className="text-sm">
            {filteredAccounts.length} contas encontradas
          </Badge>
        </div>
        
        <UnitFilter 
          selectedUnit={selectedUnit} 
          onUnitChange={setSelectedUnit}
        />
      </div>

      {selectedUnit !== 'all' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Filtro Ativo
            </Badge>
            <span className="text-sm text-blue-700">
              Mostrando contas para: <strong>{getUnitDisplayName()}</strong>
            </span>
          </div>
        </div>
      )}

      {(showAddForm || editingAccount) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingAccount ? 'Editar Conta' : 'Nova Conta'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AccountForm
              account={editingAccount}
              accounts={accounts}
              onSave={handleSaveAccount}
              onCancel={() => {
                setEditingAccount(null);
                setShowAddForm(false);
              }}
            />
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {accountTypes.map(({ type, label, description }) => {
          const typeAccounts = getAccountsByType(type);
          if (typeAccounts.length === 0) return null;

          return (
            <Card key={type}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{label}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{description}</p>
                  </div>
                  <Badge variant="secondary">
                    {typeAccounts.length} contas
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {typeAccounts.map((account) => (
                    <AccountTreeItem
                      key={account.id}
                      account={account}
                      accounts={filteredAccounts}
                      expandedAccounts={expandedAccounts}
                      onToggleExpanded={toggleExpanded}
                      onEdit={setEditingAccount}
                      onDelete={deleteAccount}
                      level={0}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAccounts.length === 0 && (searchTerm || selectedUnit !== 'all') && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm 
                ? `Nenhuma conta encontrada para "${searchTerm}"` 
                : `Nenhuma conta encontrada para a unidade "${getUnitDisplayName()}"`
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
