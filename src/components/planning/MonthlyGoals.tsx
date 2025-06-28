
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Check, X, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { useUnit } from '@/contexts/UnitContext';
import { getDataByUnit } from '@/utils/unitData';

interface MonthlyGoalsProps {
  selectedPeriod: { year: number; month: number };
  selectedUnit: string; // Keep for compatibility but use context
}

interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  category: 'receita' | 'despesa' | 'alunos' | 'margem';
}

export const MonthlyGoals = ({ selectedPeriod }: MonthlyGoalsProps) => {
  const { selectedUnit, getUnitDisplayName } = useUnit();
  const unitData = getDataByUnit(selectedUnit);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');

  // Generate goals based on selected unit data
  const generateGoalsForUnit = (): Goal[] => {
    const baseGoals: Goal[] = [
      {
        id: '1',
        title: 'Receita Mensal',
        current: unitData.receita,
        target: Math.round(unitData.receita * 1.08),
        unit: 'R$',
        category: 'receita'
      },
      {
        id: '2',
        title: 'Controle de Despesas',
        current: unitData.despesa,
        target: Math.round(unitData.despesa * 0.95),
        unit: 'R$',
        category: 'despesa'
      },
      {
        id: '3',
        title: 'Alunos Ativos',
        current: unitData.alunos,
        target: Math.round(unitData.alunos * 1.06),
        unit: '',
        category: 'alunos'
      },
      {
        id: '4',
        title: 'Margem de Lucro',
        current: Math.round(((unitData.receita - unitData.despesa) / unitData.receita) * 100 * 10) / 10,
        target: 25,
        unit: '%',
        category: 'margem'
      }
    ];

    return baseGoals;
  };

  const [goals, setGoals] = useState<Goal[]>(generateGoalsForUnit());

  // Update goals when unit changes
  React.useEffect(() => {
    setGoals(generateGoalsForUnit());
  }, [selectedUnit, unitData]);

  const getProgressPercentage = (current: number, target: number, category: string) => {
    if (category === 'despesa') {
      // For expenses, we want current to be lower than target
      return Math.min((target / current) * 100, 100);
    }
    return Math.min((current / target) * 100, 100);
  };

  const getStatusColor = (progress: number) => {
    if (progress >= 95) return 'text-green-600';
    if (progress >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (progress: number) => {
    if (progress >= 95) return <Check className="h-4 w-4 text-green-600" />;
    if (progress >= 80) return <TrendingUp className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  const monthName = new Date(selectedPeriod.year, selectedPeriod.month - 1).toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Metas Mensais - {monthName}</h2>
        </div>
        <Badge variant="outline" className="text-sm">
          {getUnitDisplayName(selectedUnit)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const progress = getProgressPercentage(goal.current, goal.target, goal.category);
          
          return (
            <Card key={goal.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{goal.title}</span>
                  {getStatusIcon(progress)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Atual</p>
                      <p className="text-2xl font-bold">
                        {goal.unit === 'R$' ? `R$ ${goal.current.toLocaleString()}` : 
                         goal.unit === '%' ? `${goal.current}%` : 
                         goal.current.toLocaleString()}{goal.unit && goal.unit !== 'R$' && goal.unit !== '%' ? ` ${goal.unit}` : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Meta</p>
                      <p className="text-xl font-semibold">
                        {goal.unit === 'R$' ? `R$ ${goal.target.toLocaleString()}` : 
                         goal.unit === '%' ? `${goal.target}%` : 
                         goal.target.toLocaleString()}{goal.unit && goal.unit !== 'R$' && goal.unit !== '%' ? ` ${goal.unit}` : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span className={getStatusColor(progress)}>
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      {goal.category === 'despesa' ? 'Redução necessária:' : 'Faltam:'} 
                    </span>
                    <span>
                      {goal.category === 'despesa' 
                        ? `R$ ${Math.max(0, goal.current - goal.target).toLocaleString()}`
                        : goal.unit === 'R$' 
                          ? `R$ ${Math.max(0, goal.target - goal.current).toLocaleString()}`
                          : goal.unit === '%'
                            ? `${Math.max(0, goal.target - goal.current).toFixed(1)}%`
                            : Math.max(0, goal.target - goal.current).toLocaleString()
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Resumo de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {goals.filter(g => getProgressPercentage(g.current, g.target, g.category) >= 95).length}
              </p>
              <p className="text-sm text-gray-600">Metas Atingidas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {goals.filter(g => {
                  const prog = getProgressPercentage(g.current, g.target, g.category);
                  return prog >= 80 && prog < 95;
                }).length}
              </p>
              <p className="text-sm text-gray-600">Em Progresso</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {goals.filter(g => getProgressPercentage(g.current, g.target, g.category) < 80).length}
              </p>
              <p className="text-sm text-gray-600">Precisam Atenção</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
