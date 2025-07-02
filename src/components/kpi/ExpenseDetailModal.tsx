
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, CreditCard, AlertTriangle, Settings } from 'lucide-react';
import { useUnit } from '@/contexts/UnitContext';
import { usePeriod } from '@/contexts/PeriodContext';
import { getMonthlyData, getCostCenterData } from '@/utils/dashboardData';
import { useKPIGoals } from '@/hooks/useKPIGoals';
import { EditGoalModal } from './EditGoalModal';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useState } from 'react';

interface ExpenseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExpenseDetailModal = ({ isOpen, onClose }: ExpenseDetailModalProps) => {
  const { selectedUnit, getUnitDisplayName } = useUnit();
  const { periodFilter, getDisplayPeriod } = usePeriod();
  const monthlyData = getMonthlyData(selectedUnit, periodFilter);
  const costCenterData = getCostCenterData(selectedUnit, periodFilter);
  const { getGoal, updateGoal, resetToDefault, updating } = useKPIGoals(selectedUnit);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const kpiName = 'Despesa Total';
  const currentGoal = getGoal(kpiName);

  const handleSaveGoal = async (newGoal: number) => {
    return await updateGoal(kpiName, newGoal);
  };

  const handleResetGoal = async () => {
    return await resetToDefault(kpiName);
  };

  const currentExpense = monthlyData[monthlyData.length - 1]?.despesa || 0;
  const previousExpense = monthlyData[monthlyData.length - 2]?.despesa || 0;
  const expenseChange = ((currentExpense - previousExpense) / previousExpense) * 100;

  const pieData = costCenterData.map((item, index) => ({
    name: item.name,
    value: item.value,
    amount: Math.round((item.value / 100) * currentExpense),
    color: item.color
  }));

  const chartData = monthlyData.map(item => ({
    month: item.month,
    despesa: item.despesa,
    budget: Math.round(item.despesa * 0.95) // Budget target 5% lower
  }));

  const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6B7280'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-red-600" />
                Despesas Totais - {getUnitDisplayName(selectedUnit)}
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
                <CardTitle className="text-sm font-medium text-gray-600">Despesa Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 mb-1">
                  R$ {currentExpense.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  {expenseChange < 0 ? (
                    <TrendingDown className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${expenseChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {expenseChange > 0 ? '+' : ''}{expenseChange.toFixed(1)}% vs anterior
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Orçamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  R$ {Math.round(currentExpense * 0.95).toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-orange-600">
                    {((currentExpense / (currentExpense * 0.95)) * 100).toFixed(1)}% utilizado
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Maior Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-gray-900 mb-1">
                  {pieData[0]?.name}
                </div>
                <div className="text-sm text-gray-600">
                  R$ {pieData[0]?.amount.toLocaleString()} ({pieData[0]?.value}%)
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Expense Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentual']} />
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
                  {pieData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">R$ {item.amount.toLocaleString()}</div>
                        <Badge variant="secondary" className="text-xs">
                          {item.value}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Expense Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução das Despesas</CardTitle>
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
                        name === 'despesa' ? 'Despesa' : 'Orçamento'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="despesa" 
                      stroke="#EF4444" 
                      strokeWidth={3}
                      dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="budget" 
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
