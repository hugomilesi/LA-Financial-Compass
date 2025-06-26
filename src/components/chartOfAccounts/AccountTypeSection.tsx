
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Account, AccountType } from '@/types/chartOfAccounts';
import { AccountTreeItem } from './AccountTreeItem';

interface AccountTypeSectionProps {
  type: AccountType;
  label: string;
  description: string;
  accounts: Account[];
  filteredAccounts: Account[];
  expandedAccounts: Set<string>;
  onToggleExpanded: (accountId: string) => void;
  onEdit: (account: Account) => void;
  onDelete: (accountId: string) => void;
}

export const AccountTypeSection = ({
  type,
  label,
  description,
  accounts,
  filteredAccounts,
  expandedAccounts,
  onToggleExpanded,
  onEdit,
  onDelete
}: AccountTypeSectionProps) => {
  const typeAccounts = filteredAccounts.filter(account => account.type === type && !account.parentId);
  
  if (typeAccounts.length === 0) return null;

  return (
    <Card>
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
              onToggleExpanded={onToggleExpanded}
              onEdit={onEdit}
              onDelete={onDelete}
              level={0}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
