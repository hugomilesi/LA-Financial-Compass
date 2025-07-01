
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Move, Calculator, Eye, EyeOff, Save } from 'lucide-react';
import { DRELineItem, DRETemplate } from '@/types/dre';
import { Account } from '@/types/chartOfAccounts';
import { CostCenterCategory } from '@/types/costCenter';

interface DREStructureBuilderProps {
  template: DRETemplate | null;
  accounts: Account[];
  costCenters: CostCenterCategory[];
  onSaveTemplate: (template: Omit<DRETemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const DREStructureBuilder = ({
  template,
  accounts,
  costCenters,
  onSaveTemplate
}: DREStructureBuilderProps) => {
  const [structure, setStructure] = useState<DRELineItem[]>(template?.structure || []);
  const [templateName, setTemplateName] = useState(template?.name || '');
  const [templateDescription, setTemplateDescription] = useState(template?.description || '');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<DRELineItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<DRELineItem>>({
    name: '',
    code: '',
    type: 'revenue',
    level: 0,
    accounts: [],
    costCenters: [],
    isCalculated: false,
    isVisible: true,
    order: structure.length
  });

  const addNewItem = () => {
    const item: DRELineItem = {
      id: Date.now().toString(),
      code: newItem.code || '',
      name: newItem.name || '',
      description: newItem.description,
      type: newItem.type as 'revenue' | 'expense' | 'subtotal' | 'total',
      level: newItem.level || 0,
      parentId: newItem.parentId,
      accounts: newItem.accounts || [],
      costCenters: newItem.costCenters || [],
      formula: newItem.formula,
      isCalculated: newItem.isCalculated || false,
      isVisible: newItem.isVisible !== false,
      order: newItem.order || structure.length
    };

    setStructure([...structure, item]);
    setNewItem({
      name: '',
      code: '',
      type: 'revenue',
      level: 0,
      accounts: [],
      costCenters: [],
      isCalculated: false,
      isVisible: true,
      order: structure.length + 1
    });
    setIsAddingItem(false);
  };

  const updateItem = (id: string, updates: Partial<DRELineItem>) => {
    setStructure(structure.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteItem = (id: string) => {
    setStructure(structure.filter(item => item.id !== id));
  };

  const moveItem = (id: string, direction: 'up' | 'down') => {
    const currentIndex = structure.findIndex(item => item.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= structure.length) return;

    const newStructure = [...structure];
    [newStructure[currentIndex], newStructure[newIndex]] = 
    [newStructure[newIndex], newStructure[currentIndex]];

    // Update order values
    newStructure.forEach((item, index) => {
      item.order = index;
    });

    setStructure(newStructure);
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) return;

    onSaveTemplate({
      name: templateName,
      description: templateDescription,
      structure,
      isDefault: false,
      isPublic: false,
      createdBy: 'current-user',
      tags: []
    });
  };

  const getTypeColor = (type: string) => {
    const colors = {
      revenue: 'bg-green-100 text-green-800',
      expense: 'bg-red-100 text-red-800',
      subtotal: 'bg-blue-100 text-blue-800',
      total: 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Construtor de Estrutura DRE</CardTitle>
        <CardDescription>
          Configure a estrutura do seu DRE personalizado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="template-name">Nome do Template</Label>
            <Input
              id="template-name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Ex: DRE Gerencial Completo"
            />
          </div>
          <div>
            <Label htmlFor="template-description">Descrição</Label>
            <Input
              id="template-description"
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              placeholder="Descrição do template"
            />
          </div>
        </div>

        {/* Structure Table */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Estrutura do DRE</h3>
            <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Adicionar Item DRE</DialogTitle>
                  <DialogDescription>
                    Configure um novo item para a estrutura do DRE
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="item-code">Código</Label>
                      <Input
                        id="item-code"
                        value={newItem.code}
                        onChange={(e) => setNewItem(prev => ({ ...prev, code: e.target.value }))}
                        placeholder="Ex: 3.01"
                      />
                    </div>
                    <div>
                      <Label htmlFor="item-type">Tipo</Label>
                      <Select
                        value={newItem.type}
                        onValueChange={(value: 'revenue' | 'expense' | 'subtotal' | 'total') => 
                          setNewItem(prev => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="revenue">Receita</SelectItem>
                          <SelectItem value="expense">Despesa</SelectItem>
                          <SelectItem value="subtotal">Subtotal</SelectItem>
                          <SelectItem value="total">Total</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="item-name">Nome</Label>
                    <Input
                      id="item-name"
                      value={newItem.name}
                      onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Receita Bruta"
                    />
                  </div>

                  <div>
                    <Label htmlFor="item-description">Descrição</Label>
                    <Textarea
                      id="item-description"
                      value={newItem.description || ''}
                      onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descrição opcional do item"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="item-level">Nível</Label>
                      <Input
                        id="item-level"
                        type="number"
                        min="0"
                        max="5"
                        value={newItem.level}
                        onChange={(e) => setNewItem(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <Checkbox
                        id="item-calculated"
                        checked={newItem.isCalculated}
                        onCheckedChange={(checked) => setNewItem(prev => ({ ...prev, isCalculated: !!checked }))}
                      />
                      <Label htmlFor="item-calculated">Item calculado</Label>
                    </div>
                  </div>

                  {newItem.isCalculated && (
                    <div>
                      <Label htmlFor="item-formula">Fórmula</Label>
                      <Input
                        id="item-formula"
                        value={newItem.formula || ''}
                        onChange={(e) => setNewItem(prev => ({ ...prev, formula: e.target.value }))}
                        placeholder="Ex: [3.01] - [4.01]"
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddingItem(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={addNewItem}>
                      Adicionar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {structure.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.code}</TableCell>
                  <TableCell>
                    <div style={{ paddingLeft: `${item.level * 20}px` }}>
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(item.type)}>
                      {item.type === 'revenue' ? 'Receita' :
                       item.type === 'expense' ? 'Despesa' :
                       item.type === 'subtotal' ? 'Subtotal' : 'Total'}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.level}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {item.isCalculated && (
                        <Badge variant="outline">
                          <Calculator className="w-3 h-3 mr-1" />
                          Calculado
                        </Badge>
                      )}
                      {item.isVisible ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveItem(item.id, 'up')}
                        disabled={index === 0}
                      >
                        <Move className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateItem(item.id, { isVisible: !item.isVisible })}
                      >
                        {item.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingItem(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {structure.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum item configurado</p>
              <p className="text-sm">Adicione itens para construir sua estrutura DRE</p>
            </div>
          )}
        </div>

        {/* Save Template */}
        <div className="flex justify-end">
          <Button onClick={handleSaveTemplate} disabled={!templateName.trim()}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
