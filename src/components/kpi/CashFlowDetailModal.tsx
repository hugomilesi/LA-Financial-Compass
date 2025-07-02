
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar, Settings } from 'lucide-react';
import { useUnit } from '@/contexts/UnitContext';
import { usePeriod } from '@/contexts/PeriodContext';
import { getMonthlyData } from '@/utils/dashboardData';
import { useKPIGoals } from '@/hooks/useKPIGoals';
import { EditGoalModal } from './EditGoalModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useState } from 'react';

interface CashFlowDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CashFlowDetailModal = ({ isOpen, onClose }: CashFlowDetailModalProps) => {
  const { selectedUnit, getUnitDisplayName } = useUnit();
  const { getDisplayPeriod } = usePeriod();
  const monthlyData = getMonthlyData(selectedUnit);
  const { getGoal, updateGoal, resetToDefault, updating } = useKPIGoals(selectedUnit);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const kpiName = 'Geração de Caixa';
  const currentGoal = getGoal(kpiName);

  const handleSaveGoal = async (newGoal: number) => {
    return await updateGoal(kpiName, newGoal);
  };

  const handleResetGoal = async () => {
    return await resetToDefault(kpiName);
  };

  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  
  const currentCashFlow = currentMonth.receita - currentMonth.despesa;
  const previousCashFlow = previousMonth.receita - previousMonth.despesa;
  const cashFlowChange = ((currentCashFlow - previousCashFlow) / previousCashFlow) * 100;

  const chartData = monthlyData.map(item => ({
    month: item.month,
    receita: item.receita,
    despesa: item.despesa,
    cashFlow: item.receita - item.despesa
  }));

  const cumulativeCashFlow = chartData.reduce((acc, current, index) => {
    const cumulative = index === 0 ? current.cashFlow : acc[index - 1].cumulative + current.cashFlow;
    acc.push({ ...current, cumulative });
    return acc;
  }, [] as any[]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Geração de Caixa - {getUnitDisplayName(selectedUnit)}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Caixa Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  R$ {currentCashFlow.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  {cashFlowChange > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${cashFlowChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {cashFlowChange > 0 ? '+' : ''}{cashFlowChange.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Receita</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-blue-600 mb-1">
                  R$ {currentMonth.receita.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Entrada do mês</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Despesas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-red-600 mb-1">
                  R$ {currentMonth.despesa.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Saída do mês</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Margem</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-purple-600 mb-1">
                  {((currentCashFlow / currentMonth.receita) * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600">Margem de caixa</div>
              </CardContent>
            </Card>
          </div>

          {/* Cash Flow Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Receita vs Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        `R$ ${Number(value).toLocaleString()}`,
                        name === 'receita' ? 'Receita' : 
                        name === 'despesa' ? 'Despesas' : 'Caixa Líquido'
                      ]}
                    />
                    <Bar dataKey="receita" fill="#10B981" name="receita" />
                    <Bar dataKey="despesa" fill="#EF4444" name="despesa" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Cumulative Cash Flow */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução do Caixa Acumulado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cumulativeCashFlow}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        `R$ ${Number(value).toLocaleString()}`,
                        name === 'cashFlow' ? 'Caixa Mensal' : 'Caixa Acumulado'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cashFlow" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cumulative" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Cash Flow Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Melhor Mês</span>
                    <div className="text-right">
                      <div className="font-semibold">
                        {chartData.reduce((max, current) => 
                          current.cashFlow > max.cashFlow ? current : max
                        ).month}
                      </div>
                      <div className="text-xs text-gray-500">
                        R$ {Math.max(...chartData.map(d => d.cashFlow)).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pior Mês</span>
                    <div className="text-right">
                      <div className="font-semibold">
                        {chartData.reduce((min, current) => 
                          current.cashFlow < min.cashFlow ? current : min
                        ).month}
                      </div>
                      <div className="text-xs text-gray-500">
                        R$ {Math.min(...chartData.map(d => d.cashFlow)).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Média Mensal</span>
                    <div className="text-right">
                      <div className="font-semibold">
                        R$ {Math.round(chartData.reduce((sum, d) => sum + d.cashFlow, 0) / chartData.length).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Próximas Ações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium">Manter ritmo atual</p>
                      <p className="text-xs text-gray-500">Geração de caixa positiva</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium">Otimizar despesas</p>
                      <p className="text-xs text-gray-500">Identificar reduções possíveis</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium">Investir em crescimento</p>
                      <p className="text-xs text-gray-500">Usar caixa para expansão</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
