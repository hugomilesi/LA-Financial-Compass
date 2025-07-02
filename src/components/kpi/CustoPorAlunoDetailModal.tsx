
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar, Settings } from 'lucide-react';
import { useUnit } from '@/contexts/UnitContext';
import { usePeriod } from '@/contexts/PeriodContext';
import { getHistoricalDataByUnit } from '@/utils/unitData';
import { useKPIGoals } from '@/hooks/useKPIGoals';
import { EditGoalModal } from './EditGoalModal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';

interface CustoPorAlunoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustoPorAlunoDetailModal = ({ isOpen, onClose }: CustoPorAlunoDetailModalProps) => {
  const { selectedUnit, getUnitDisplayName } = useUnit();
  const { getDisplayPeriod } = usePeriod();
  const historicalData = getHistoricalDataByUnit(selectedUnit);
  const { getGoal, updateGoal, resetToDefault, updating } = useKPIGoals(selectedUnit);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const kpiName = 'Custo por Aluno';
  const currentGoal = getGoal(kpiName);

  const handleSaveGoal = async (newGoal: number) => {
    return await updateGoal(kpiName, newGoal);
  };

  const handleResetGoal = async () => {
    return await resetToDefault(kpiName);
  };

  // Calculate custo por aluno evolution
  const custoData = historicalData.map(item => ({
    month: item.month,
    custoPorAluno: Math.round(item.despesa / (item.alunos || 400)),
    meta: 200
  }));

  const currentCusto = custoData[custoData.length - 1]?.custoPorAluno || 0;
  const previousCusto = custoData[custoData.length - 2]?.custoPorAluno || 0;
  const custoChange = ((currentCusto - previousCusto) / previousCusto) * 100;

  // Cost breakdown by category
  const costBreakdown = [
    { name: 'Pessoal', value: Math.round(currentCusto * 0.583), color: '#EF4444' },
    { name: 'Aluguel', value: Math.round(currentCusto * 0.182), color: '#F59E0B' },
    { name: 'Marketing', value: Math.round(currentCusto * 0.125), color: '#10B981' },
    { name: 'Operacional', value: Math.round(currentCusto * 0.087), color: '#3B82F6' },
    { name: 'Outros', value: Math.round(currentCusto * 0.023), color: '#6B7280' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-red-600" />
                Custo por Aluno - {getUnitDisplayName(selectedUnit)}
              </DialogTitle>
              <p className="text-sm text-gray-600">{getDisplayPeriod()}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Editar Meta
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Custo Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 mb-1">
                  R$ {currentCusto}
                </div>
                <div className="flex items-center gap-1">
                  {custoChange < 0 ? (
                    <TrendingDown className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${custoChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {custoChange > 0 ? '+' : ''}{custoChange.toFixed(1)}% vs anterior
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Meta Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  R$ 200
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span className={`text-sm ${currentCusto <= 200 ? 'text-green-600' : 'text-red-600'}`}>
                    {currentCusto <= 200 ? 'Meta atingida' : 'Acima da meta'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Eficiência</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {((200 / currentCusto) * 100).toFixed(0)}%
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-purple-600">vs meta ideal</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cost Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Custos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costBreakdown}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: R$ ${value}`}
                      >
                        {costBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`R$ ${value}`, 'Custo']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalhamento por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {costBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">R$ {item.value}</div>
                        <Badge variant="secondary" className="text-xs">
                          {((item.value / currentCusto) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cost Evolution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução do Custo por Aluno</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={custoData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        `R$ ${Number(value)}`,
                        name === 'custoPorAluno' ? 'Custo por Aluno' : 'Meta'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="custoPorAluno" 
                      stroke="#EF4444" 
                      strokeWidth={3}
                      dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="meta" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>

      <EditGoalModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        kpiName={kpiName}
        currentGoal={currentGoal}
        unit="R$"
        onSave={handleSaveGoal}
        onReset={handleResetGoal}
        isUpdating={updating}
      />
    </Dialog>
  );
};
