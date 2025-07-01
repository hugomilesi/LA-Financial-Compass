import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Account, AccountType } from '@/types/chartOfAccounts';

interface AccountFormProps {
  account?: Account | null;
  accounts: Account[];
  onSave: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const AccountForm = ({ account, accounts, onSave, onCancel }: AccountFormProps) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'expense' as AccountType,
    parentId: 'none', // Use 'none' instead of empty string
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (account) {
      setFormData({
        code: account.code,
        name: account.name,
        description: account.description || '',
        type: account.type,
        parentId: account.parentId || 'none', // Use 'none' instead of empty string
        isActive: account.isActive
      });
    }
  }, [account]);

  const accountTypes = [
    { value: 'revenue', label: 'Receita' },
    { value: 'expense', label: 'Despesa' },
    { value: 'liability', label: 'Passivo' },
    { value: 'equity', label: 'Patrimônio Líquido' }
  ];

  const getParentAccountsForType = (type: AccountType) => {
    return accounts.filter(acc => 
      acc.type === type && 
      (!account || acc.id !== account.id) // Exclude self when editing
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Código é obrigatório';
    } else if (accounts.some(acc => acc.code === formData.code && (!account || acc.id !== account.id))) {
      newErrors.code = 'Este código já existe';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.type) {
      newErrors.type = 'Tipo é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Convert 'none' back to undefined for parentId
    const actualParentId = formData.parentId === 'none' ? undefined : formData.parentId;
    
    const level = actualParentId 
      ? (accounts.find(acc => acc.id === actualParentId)?.level || 0) + 1 
      : 0;

    onSave({
      ...formData,
      parentId: actualParentId,
      level,
      hasChildren: false
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Código da Conta *</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="Ex: 3.1.01.01"
          />
          {errors.code && <p className="text-sm text-red-600">{errors.code}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo de Conta *</Label>
          <Select value={formData.type} onValueChange={(value: AccountType) => 
            setFormData({ ...formData, type: value, parentId: 'none' })
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {accountTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nome da Conta *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ex: Receita de Mensalidades"
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="parent">Conta Pai (opcional)</Label>
        <Select value={formData.parentId} onValueChange={(value) => 
          setFormData({ ...formData, parentId: value })
        }>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma conta pai" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhuma (conta principal)</SelectItem>
            {getParentAccountsForType(formData.type).map((parentAccount) => (
              <SelectItem key={parentAccount.id} value={parentAccount.id}>
                {parentAccount.code} - {parentAccount.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descrição opcional da conta"
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label htmlFor="isActive">Conta ativa</Label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit">
          {account ? 'Atualizar' : 'Criar'} Conta
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};
