
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

export const ChartOfAccountsPage = () => {
  const { accounts, addAccount, updateAccount, deleteAccount } = useChartOfAccounts();
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredAccounts = accounts.filter(account => 
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.code.includes(searchTerm)
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

      <div className="flex gap-4 items-center">
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
                      accounts={accounts}
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

      {filteredAccounts.length === 0 && searchTerm && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Nenhuma conta encontrada para "{searchTerm}"</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
