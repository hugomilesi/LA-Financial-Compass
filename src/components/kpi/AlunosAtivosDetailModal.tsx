
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Users, Target, Calendar, Settings } from 'lucide-react';
import { useUnit } from '@/contexts/UnitContext';
import { usePeriod } from '@/contexts/PeriodContext';
import { getHistoricalDataByUnit } from '@/utils/unitData';
import { useKPIGoals } from '@/hooks/useKPIGoals';
import { EditGoalModal } from './EditGoalModal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useState } from 'react';

interface AlunosAtivosDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlunosAtivosDetailModal = ({ isOpen, onClose }: AlunosAtivosDetailModalProps) => {
  const { selectedUnit, getUnitDisplayName } = useUnit();
  const { getDisplayPeriod } = usePeriod();
  const historicalData = getHistoricalDataByUnit(selectedUnit);
  const { getGoal, updateGoal, resetToDefault, updating } = useKPIGoals(selectedUnit);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const kpiName = 'Alunos Ativos';
  const currentGoal = getGoal(kpiName);

  const handleSaveGoal = async (newGoal: number) => {
    return await updateGoal(kpiName, newGoal);
  };

  const handleResetGoal = async () => {
    return await resetToDefault(kpiName);
  };

  // Calculate alunos ativos evolution
  const alunosData = historicalData.map(item => ({
    month: item.month,
    alunosAtivos: item.alunos || 400,
    meta: 450,
    novosAlunos: Math.round(20 + Math.random() * 15),
    cancelamentos: Math.round(8 + Math.random() * 10)
  }));

  const currentAlunos = alunosData[alunosData.length - 1]?.alunosAtivos || 0;
  const previousAlunos = alunosData[alunosData.length - 2]?.alunosAtivos || 0;
  const alunosChange = ((currentAlunos - previousAlunos) / previousAlunos) * 100;

  // Student distribution by category
  const studentDistribution = [
    { category: 'Educação Infantil', quantity: Math.round(currentAlunos * 0.35), percentage: 35 },
    { category: 'Ensino Fundamental I', quantity: Math.round(currentAlunos * 0.40), percentage: 40 },
    { category: 'Ensino Fundamental II', quantity: Math.round(currentAlunos * 0.25), percentage: 25 }
  ];

  const currentNovos = alunosData[alunosData.length - 1]?.novosAlunos || 0;
  const currentCancelamentos = alunosData[alunosData.length - 1]?.cancelamentos || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Alunos Ativos - {getUnitDisplayName(selectedUnit)}
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
                <CardTitle className="text-sm font-medium text-gray-600">Alunos Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {currentAlunos.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  {alunosChange > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${alunosChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {alunosChange > 0 ? '+' : ''}{alunosChange.toFixed(1)}% vs anterior
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Meta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  450
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">
                    {((currentAlunos / 450) * 100).toFixed(1)}% atingido
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Novos Alunos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {currentNovos}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-purple-600">Este mês</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Cancelamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {currentCancelamentos}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">Este mês</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Student Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Segmento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-500' : 
                        index === 1 ? 'bg-green-500' : 'bg-purple-500'
                      }`} />
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{item.quantity} alunos</div>
                      <Badge variant="secondary" className="text-xs">
                        {item.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Students Evolution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução de Alunos Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={alunosData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        Number(value),
                        name === 'alunosAtivos' ? 'Alunos Ativos' : 'Meta'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="alunosAtivos" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="meta" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Movement Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Movimentação Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={alunosData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="novosAlunos" fill="#10B981" name="Novos Alunos" />
                    <Bar dataKey="cancelamentos" fill="#EF4444" name="Cancelamentos" />
                  </BarChart>
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
        onSave={handleSaveGoal}
        onReset={handleResetGoal}
        isUpdating={updating}
      />
    </Dialog>
  );
};
