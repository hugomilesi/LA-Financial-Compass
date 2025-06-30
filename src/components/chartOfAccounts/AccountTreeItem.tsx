
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronDown, Edit, Trash2, GripVertical, AlertTriangle } from 'lucide-react';
import { Account } from '@/types/chartOfAccounts';
import { AccountTags } from './AccountTags';
import { AccountNotes } from './AccountNotes';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface AccountTreeItemProps {
  account: Account;
  accounts: Account[];
  expandedAccounts: Set<string>;
  onToggleExpanded: (accountId: string) => void;
  onEdit: (account: Account) => void;
  onDelete: (accountId: string) => void;
  onUpdateNotes: (accountId: string, notes: string) => void;
  level: number;
  alerts?: any[];
}

export const AccountTreeItem = ({
  account,
  accounts,
  expandedAccounts,
  onToggleExpanded,
  onEdit,
  onDelete,
  onUpdateNotes,
  level,
  alerts = []
}: AccountTreeItemProps) => {
  const [showNotes, setShowNotes] = useState(false);
  const childAccounts = accounts.filter(acc => acc.parentId === account.id);
  const isExpanded = expandedAccounts.has(account.id);
  const hasChildren = childAccounts.length > 0;
  const accountAlerts = alerts.filter(alert => alert.accountId === account.id);

  const handleDelete = () => {
    if (hasChildren) {
      alert('Não é possível excluir uma conta que possui subcontas. Exclua primeiro as subcontas.');
      return;
    }
    
    if (confirm(`Tem certeza que deseja excluir a conta "${account.name}"?`)) {
      onDelete(account.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'pending': return 'Pendente';
      case 'blocked': return 'Bloqueado';
      default: return status;
    }
  };

  return (
    <div className="space-y-1">
      <div 
        className={cn(
          "flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors",
          level > 0 && "ml-6 border-l-2 border-l-primary-200",
          !account.isActive && "opacity-60"
        )}
      >
        <div className="flex items-center gap-3 flex-1">
          <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
          
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleExpanded(account.id)}
              className="p-1 h-6 w-6"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <div className="w-6" />
          )}
          
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                {account.code}
              </code>
              <span className="font-medium">{account.name}</span>
              
              <Badge variant="secondary" className={getStatusColor(account.status || 'active')}>
                {getStatusLabel(account.status || 'active')}
              </Badge>
              
              {accountAlerts.length > 0 && (
                <Badge variant="outline" className="text-amber-600 border-amber-200">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {accountAlerts.length}
                </Badge>
              )}
              
              <AccountTags tags={account.tags || []} readonly />
            </div>
            
            {account.description && (
              <p className="text-sm text-gray-600 mt-1">{account.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {account.balance !== undefined && (
            <span className={cn(
              "text-sm font-medium",
              account.balance >= 0 ? "text-green-600" : "text-red-600"
            )}>
              {account.balance >= 0 ? '+' : ''}
              {account.balance.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </span>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNotes(!showNotes)}
            className="p-2 h-8 w-8"
          >
            📝
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(account)}
            className="p-2 h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="p-2 h-8 w-8 text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showNotes && (
        <div className="ml-6">
          <AccountNotes
            notes={account.notes}
            onSave={(notes) => onUpdateNotes(account.id, notes)}
          />
        </div>
      )}

      {hasChildren && isExpanded && (
        <div className="space-y-1">
          {childAccounts.map((childAccount) => (
            <AccountTreeItem
              key={childAccount.id}
              account={childAccount}
              accounts={accounts}
              expandedAccounts={expandedAccounts}
              onToggleExpanded={onToggleExpanded}
              onEdit={onEdit}
              onDelete={onDelete}
              onUpdateNotes={onUpdateNotes}
              level={level + 1}
              alerts={alerts}
            />
          ))}
        </div>
      )}
    </div>
  );
};
