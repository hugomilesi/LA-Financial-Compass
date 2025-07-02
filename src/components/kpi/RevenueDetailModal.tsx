
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar, Settings } from 'lucide-react';
import { useUnit } from '@/contexts/UnitContext';
import { usePeriod } from '@/contexts/PeriodContext';
import { useKPIGoals } from '@/hooks/useKPIGoals';
import { getMonthlyData } from '@/utils/dashboardData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { EditGoalModal } from './EditGoalModal';
import { useState } from 'react';

interface RevenueDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RevenueDetailModal = ({ isOpen, onClose }: RevenueDetailModalProps) => {
  const { selectedUnit, getUnitDisplayName } = useUnit();
  const { getDisplayPeriod } = usePeriod();
  const { getGoal, updateGoal, resetToDefault, updating } = useKPIGoals(selectedUnit);
  const [isEditGoalOpen, setIsEditGoalOpen] = useState(false);
  const monthlyData = getMonthlyData(selectedUnit);

  const currentRevenue = monthlyData[monthlyData.length - 1]?.receita || 0;
  const previousRevenue = monthlyData[monthlyData.length - 2]?.receita || 0;
  const revenueChange = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
  const revenueGoal = getGoal('Receita Total');

  // Revenue breakdown
  const revenueBreakdown = [
    { category: 'Mensalidades', value: Math.round(currentRevenue * 0.796), percentage: 79.6 },
    { category: 'Matrículas', value: Math.round(currentRevenue * 0.132), percentage: 13.2 },
    { category: 'Outros', value: Math.round(currentRevenue * 0.072), percentage: 7.2 }
  ];

  const chartData = monthlyData.map(item => ({
    month: item.month,
    receita: item.receita,
    meta: revenueGoal
  }));

  const handleSaveGoal = async (newGoal: number) => {
    return await updateGoal('Receita Total', newGoal);
  };

  const handleResetGoal = async () => {
    return await resetToDefault('Receita Total');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Receita Total - {getUnitDisplayName(selectedUnit)}
          </DialogTitle>
          <p className="text-sm text-gray-600">{getDisplayPeriod()}</p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Receita Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  R$ {currentRevenue.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  {revenueChange > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${revenueChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {revenueChange > 0 ? '+' : ''}{revenueChange.toFixed(1)}% vs anterior
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Meta Mensal</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditGoalOpen(true)}
                    className="h-6 w-6 p-0"
                  >
                    <Settings className="w-3 h-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  R$ {revenueGoal.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-600">
                    {((currentRevenue / revenueGoal) * 100).toFixed(1)}% atingido
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Projeção</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  R$ {Math.round(currentRevenue * 1.05).toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-purple-600">Próximo mês</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Composição da Receita</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-green-500' : 
                        index === 1 ? 'bg-blue-500' : 'bg-purple-500'
                      }`} />
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">R$ {item.value.toLocaleString()}</div>
                      <Badge variant="secondary" className="text-xs">
                        {item.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenue Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução da Receita</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        `R$ ${Number(value).toLocaleString()}`,
                        name === 'receita' ? 'Receita' : 'Meta'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="receita" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
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

      {/* Edit Goal Modal */}
      <EditGoalModal
        isOpen={isEditGoalOpen}
        onClose={() => setIsEditGoalOpen(false)}
        kpiName="Receita Total"
        currentGoal={revenueGoal}
        unit="R$"
        onSave={handleSaveGoal}
        onReset={handleResetGoal}
        isUpdating={updating}
      />
    </Dialog>
  );
};
