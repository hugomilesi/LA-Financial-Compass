
import { Account } from '@/types/chartOfAccounts';

export const exportAccountsToExcel = (accounts: Account[], unitName: string = 'Todas as Unidades') => {
  // Criar dados CSV
  const headers = [
    'Código',
    'Nome',
    'Tipo',
    'Descrição',
    'Status',
    'Tags',
    'Notas',
    'Nível',
    'Possui Filhos',
    'Saldo',
    'Criado em',
    'Atualizado em'
  ];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'revenue': return 'Receita';
      case 'expense': return 'Despesa';
      case 'asset': return 'Ativo';
      case 'liability': return 'Passivo';
      case 'equity': return 'Patrimônio Líquido';
      default: return type;
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

  const rows = accounts.map(account => [
    account.code,
    account.name,
    getTypeLabel(account.type),
    account.description || '',
    getStatusLabel(account.status || 'active'),
    account.tags?.join(', ') || '',
    account.notes || '',
    account.level.toString(),
    account.hasChildren ? 'Sim' : 'Não',
    account.balance?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || '',
    account.createdAt.toLocaleString('pt-BR'),
    account.updatedAt.toLocaleString('pt-BR')
  ]);

  // Converter para CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Adicionar BOM para UTF-8
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Criar link para download
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `plano-contas-${unitName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateAccountAlerts = (accounts: Account[]) => {
  const alerts = [];
  
  for (const account of accounts) {
    // Conta não utilizada há muito tempo
    if (account.lastUsed && account.lastUsed < new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)) {
      alerts.push({
        id: `${account.id}-unused`,
        accountId: account.id,
        type: 'warning' as const,
        message: `Conta não utilizada há mais de 90 dias`,
        severity: 'medium' as const,
        createdAt: new Date()
      });
    }
    
    // Conta sem descrição
    if (!account.description) {
      alerts.push({
        id: `${account.id}-no-desc`,
        accountId: account.id,
        type: 'info' as const,
        message: `Conta sem descrição`,
        severity: 'low' as const,
        createdAt: new Date()
      });
    }
    
    // Conta com saldo zerado há muito tempo
    if (account.balance === 0 && account.type !== 'equity') {
      alerts.push({
        id: `${account.id}-zero-balance`,
        accountId: account.id,
        type: 'info' as const,
        message: `Conta com saldo zerado`,
        severity: 'low' as const,
        createdAt: new Date()
      });
    }
  }
  
  return alerts;
};
