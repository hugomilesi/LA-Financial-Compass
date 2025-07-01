
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CostCenterCategory } from '@/types/costCenter';
import { useChartOfAccounts } from '@/hooks/useChartOfAccounts';
import * as LucideIcons from 'lucide-react';

interface CostCenterCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: CostCenterCategory | null;
  onSave: (categoryData: Omit<CostCenterCategory, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const colorOptions = [
  { value: '#EF4444', label: 'Vermelho' },
  { value: '#F59E0B', label: 'Laranja' },
  { value: '#10B981', label: 'Verde' },
  { value: '#3B82F6', label: 'Azul' },
  { value: '#8B5CF6', label: 'Roxo' },
  { value: '#F97316', label: 'Laranja Escuro' },
  { value: '#06B6D4', label: 'Ciano' },
  { value: '#84CC16', label: 'Lima' },
  { value: '#6B7280', label: 'Cinza' }
];

const iconOptions = [
  'Users', 'Building', 'Megaphone', 'Settings', 'MoreHorizontal',
  'DollarSign', 'TrendingUp', 'Target', 'Award', 'AlertTriangle',
  'BookOpen', 'Music', 'Calendar', 'Clock', 'Mail'
];

export const CostCenterCategoryModal = ({
  isOpen,
  onClose,
  category,
  onSave
}: CostCenterCategoryModalProps) => {
  const { accounts } = useChartOfAccounts();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    icon: 'Settings',
    isActive: true,
    accounts: [] as string[],
    totalAmount: 0,
    percentage: 0,
    unitBreakdown: []
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        color: category.color,
        icon: category.icon,
        isActive: category.isActive,
        accounts: category.accounts,
        totalAmount: category.totalAmount,
        percentage: category.percentage,
        unitBreakdown: category.unitBreakdown
      });
    } else {
      setFormData({
        name: '',
        description: '',
        color: '#3B82F6',
        icon: 'Settings',
        isActive: true,
        accounts: [],
        totalAmount: 0,
        percentage: 0,
        unitBreakdown: []
      });
    }
  }, [category]);

  const expenseAccounts = accounts.filter(acc => acc.type === 'expense');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSave(formData);
  };

  const handleAccountToggle = (accountId: string) => {
    setFormData(prev => ({
      ...prev,
      accounts: prev.accounts.includes(accountId)
        ? prev.accounts.filter(id => id !== accountId)
        : [...prev.accounts, accountId]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Editar Categoria' : 'Nova Categoria de Centro de Custos'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Categoria</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Pessoal, Marketing..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Cor</Label>
              <Select value={formData.color} onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: formData.color }}
                    />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: color.value }}
                        />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon">Ícone</Label>
              <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const IconComponent = (LucideIcons as any)[formData.icon] || LucideIcons.Settings;
                      return <IconComponent className="h-4 w-4" />;
                    })()}
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((iconName) => {
                    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Settings;
                    return (
                      <SelectItem key={iconName} value={iconName}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          {iconName}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="active">Status</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="active" className="text-sm">
                  {formData.isActive ? 'Ativa' : 'Inativa'}
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o que esta categoria representa..."
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label>Contas do Plano de Contas Vinculadas</Label>
            <div className="max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2">
              {expenseAccounts.length > 0 ? (
                expenseAccounts.map((account) => (
                  <div key={account.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`account-${account.id}`}
                      checked={formData.accounts.includes(account.id)}
                      onChange={() => handleAccountToggle(account.id)}
                      className="rounded"
                    />
                    <Label 
                      htmlFor={`account-${account.id}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {account.code} - {account.name}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Nenhuma conta de despesa encontrada</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {category ? 'Atualizar' : 'Criar'} Categoria
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
