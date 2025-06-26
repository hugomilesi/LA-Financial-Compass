
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Save, X, History } from 'lucide-react';

interface MonthlyGoalsProps {
  selectedPeriod: { year: number; month: number };
  selectedUnit: string;
}

interface Goal {
  id: string;
  indicator: string;
  target: number;
  unit: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export const MonthlyGoals = ({ selectedPeriod, selectedUnit }: MonthlyGoalsProps) => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      indicator: 'Receita Mensal',
      target: 200000,
      unit: 'R$',
      description: 'Meta de receita bruta mensal',
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      indicator: 'Margem de Lucro',
      target: 30,
      unit: '%',
      description: 'Percentual de margem de lucro líquido',
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: '3',
      indicator: 'Alunos Ativos',
      target: 900,
      unit: 'unidades',
      description: 'Número total de alunos ativos',
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({
    indicator: '',
    target: '',
    unit: '',
    description: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSave = (id: string) => {
    setEditingId(null);
    // Here you would save to backend
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setNewGoal({ indicator: '', target: '', unit: '', description: '' });
  };

  const handleAddGoal = () => {
    if (newGoal.indicator && newGoal.target) {
      const goal: Goal = {
        id: Date.now().toString(),
        indicator: newGoal.indicator,
        target: parseFloat(newGoal.target),
        unit: newGoal.unit,
        description: newGoal.description,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setGoals([...goals, goal]);
      setNewGoal({ indicator: '', target: '', unit: '', description: '' });
      setShowAddForm(false);
    }
  };

  const monthName = new Date(selectedPeriod.year, selectedPeriod.month - 1).toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Metas Mensais - {monthName}</h2>
          <p className="text-sm text-gray-600 mt-1">Defina e acompanhe as metas por indicador</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Meta
        </Button>
      </div>

      {showAddForm && (
        <Card className="border-2 border-dashed border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Nova Meta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="indicator">Indicador</Label>
                <Input
                  id="indicator"
                  value={newGoal.indicator}
                  onChange={(e) => setNewGoal({ ...newGoal, indicator: e.target.value })}
                  placeholder="Ex: Receita Mensal"
                />
              </div>
              <div>
                <Label htmlFor="target">Meta</Label>
                <Input
                  id="target"
                  type="number"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                  placeholder="Ex: 200000"
                />
              </div>
              <div>
                <Label htmlFor="unit">Unidade</Label>
                <Input
                  id="unit"
                  value={newGoal.unit}
                  onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                  placeholder="Ex: R$, %, unidades"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="Descrição da meta"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAddGoal} className="gap-2">
                <Save className="h-4 w-4" />
                Salvar Meta
              </Button>
              <Button variant="outline" onClick={handleCancel} className="gap-2">
                <X className="h-4 w-4" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {goals.map((goal) => (
          <Card key={goal.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {editingId === goal.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Indicador</Label>
                        <Input defaultValue={goal.indicator} />
                      </div>
                      <div>
                        <Label>Meta</Label>
                        <Input type="number" defaultValue={goal.target} />
                      </div>
                      <div>
                        <Label>Unidade</Label>
                        <Input defaultValue={goal.unit} />
                      </div>
                      <div className="md:col-span-3">
                        <Label>Descrição</Label>
                        <Input defaultValue={goal.description} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{goal.indicator}</h3>
                        <Badge variant={goal.status === 'active' ? 'default' : 'secondary'}>
                          {goal.status === 'active' ? 'Ativa' : 'Rascunho'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Meta: <strong>{goal.target.toLocaleString()} {goal.unit}</strong></span>
                        <span>•</span>
                        <span>Atualizado em: {new Date(goal.updatedAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <p className="text-sm text-gray-700">{goal.description}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 ml-4">
                  {editingId === goal.id ? (
                    <>
                      <Button size="sm" onClick={() => handleSave(goal.id)} className="gap-1">
                        <Save className="h-3 w-3" />
                        Salvar
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel} className="gap-1">
                        <X className="h-3 w-3" />
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(goal.id)} className="gap-1">
                        <Edit className="h-3 w-3" />
                        Editar
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1">
                        <History className="h-3 w-3" />
                        Histórico
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
