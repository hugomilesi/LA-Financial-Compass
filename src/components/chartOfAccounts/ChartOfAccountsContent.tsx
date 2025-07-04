
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
  onSaveAccount: (accountData: Omit<Account, 'id'>) => void;
  onCancelForm: () => void;
  loading?: boolean;
  error?: string | null;
}

const accountTypes: { type: AccountType; label: string; description: string }[] = [
  { type: 'revenue', label: 'Receitas', description: 'Contas de receita e faturamento' },
  { type: 'expense', label: 'Despesas', description: 'Contas de custos e despesas' },
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
  onSaveAccount,
  onCancelForm,
  loading,
  error
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
      {/* Feedback visual de loading */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></span>
          <span className="ml-3 text-gray-500">Carregando plano de contas...</span>
        </div>
      )}

      {/* Feedback visual de erro */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Erro: </strong>
          <span className="block sm:inline">{error}</span>
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
              onSave={onSaveAccount}
              onCancel={onCancelForm}
            />
          </CardContent>
        </Card>
      )}

      {/* Só exibe conteúdo principal se não estiver carregando nem com erro */}
      {!loading && !error && (
        <>
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
              />
            ))}
          </div>

          {/* Mensagem de vazio (apenas se não estiver carregando nem erro) */}
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
      )}
    </>
  );
};
