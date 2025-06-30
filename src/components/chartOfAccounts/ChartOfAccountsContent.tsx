
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Account, AccountType } from '@/types/chartOfAccounts';
import { AccountForm } from './AccountForm';
import { AccountTypeSection } from './AccountTypeSection';

interface ChartOfAccountsContentProps {
  accounts: Account[];
  filteredAccounts: Account[];
  expandedAccounts: Set<string>;
  editingAccount: Account | null;
  showAddForm: boolean;
  searchTerm: string;
  selectedUnit: string;
  onToggleExpanded: (accountId: string) => void;
  onEdit: (account: Account) => void;
  onDelete: (accountId: string) => void;
  onUpdateNotes: (accountId: string, notes: string) => void;
  onSaveAccount: (accountData: Omit<Account, 'id'>) => void;
  onCancelForm: () => void;
  alerts: any[];
}

const accountTypes: { type: AccountType; label: string; description: string }[] = [
  { type: 'revenue', label: 'Receitas', description: 'Contas de receita e faturamento' },
  { type: 'expense', label: 'Despesas', description: 'Contas de custos e despesas' },
  { type: 'asset', label: 'Ativo', description: 'Bens e direitos' },
  { type: 'liability', label: 'Passivo', description: 'Obrigações e dívidas' },
  { type: 'equity', label: 'Patrimônio Líquido', description: 'Capital e reservas' }
];

export const ChartOfAccountsContent = ({
  accounts,
  filteredAccounts,
  expandedAccounts,
  editingAccount,
  showAddForm,
  searchTerm,
  selectedUnit,
  onToggleExpanded,
  onEdit,
  onDelete,
  onUpdateNotes,
  onSaveAccount,
  onCancelForm,
  alerts
}: ChartOfAccountsContentProps) => {
  const getUnitDisplayName = () => {
    switch (selectedUnit) {
      case 'campo-grande': return 'Campo Grande';
      case 'recreio': return 'Recreio';
      case 'barra': return 'Barra';
      default: return 'Todas as Unidades';
    }
  };

  return (
    <>
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
              onSave={onSaveAccount}
              onCancel={onCancelForm}
            />
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {accountTypes.map(({ type, label, description }) => (
          <AccountTypeSection
            key={type}
            type={type}
            label={label}
            description={description}
            accounts={accounts}
            filteredAccounts={filteredAccounts}
            expandedAccounts={expandedAccounts}
            onToggleExpanded={onToggleExpanded}
            onEdit={onEdit}
            onDelete={onDelete}
            onUpdateNotes={onUpdateNotes}
            alerts={alerts}
          />
        ))}
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
    </>
  );
};
