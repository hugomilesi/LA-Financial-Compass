
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Calendar, Settings } from 'lucide-react';
import { useUnit } from '@/contexts/UnitContext';
import { usePeriod } from '@/contexts/PeriodContext';
import { getHistoricalDataByUnit } from '@/utils/unitData';
import { useKPIGoals } from '@/hooks/useKPIGoals';
import { EditGoalModal } from './EditGoalModal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useState } from 'react';

interface InadimplenciaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InadimplenciaDetailModal = ({ isOpen, onClose }: InadimplenciaDetailModalProps) => {
  const { selectedUnit, getUnitDisplayName } = useUnit();
  const { getDisplayPeriod } = usePeriod();
  const historicalData = getHistoricalDataByUnit(selectedUnit);
  const { getGoal, updateGoal, resetToDefault, updating } = useKPIGoals(selectedUnit);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const kpiName = 'Inadimplência (%)';
  const currentGoal = getGoal(kpiName);

  const handleSaveGoal = async (newGoal: number) => {
    return await updateGoal(kpiName, newGoal);
  };

  const handleResetGoal = async () => {
    return await resetToDefault(kpiName);
  };

  // Calculate inadimplência evolution
  const getInadimplenciaRate = (unitId: string) => {
    const baseRates = {
      'campo-grande': 4.2,
      'recreio': 3.8,
      'barra': 5.1
    };
    
    if (unitId === 'all') {
      return 4.4;
    }
    
    return baseRates[unitId as keyof typeof baseRates] || 4.0;
  };

  const inadimplenciaData = historicalData.map((item, index) => {
    const baseRate = getInadimplenciaRate(selectedUnit);
    const variation = (Math.random() - 0.5) * 0.8; // ±0.4% variation
    const rate = Math.max(2.5, Math.min(6.0, baseRate + variation - (index * 0.1))); // Trending down
    
    return {
      month: item.month,
      inadimplencia: Math.round(rate * 10) / 10,
      meta: 3.0,
      valorInadimplente: Math.round((rate / 100) * item.receita)
    };
  });

  const currentRate = inadimplenciaData[inadimplenciaData.length - 1]?.inadimplencia || 0;
  const previousRate = inadimplenciaData[inadimplenciaData.length - 2]?.inadimplencia || 0;
  const rateChange = currentRate - previousRate;

  // Inadimplência breakdown by age
  const inadimplenciaBreakdown = [
    { category: '1-30 dias', percentage: 45, valor: Math.round(inadimplenciaData[inadimplenciaData.length - 1]?.valorInadimplente * 0.45) },
    { category: '31-60 dias', percentage: 30, valor: Math.round(inadimplenciaData[inadimplenciaData.length - 1]?.valorInadimplente * 0.30) },
    { category: '61-90 dias', percentage: 15, valor: Math.round(inadimplenciaData[inadimplenciaData.length - 1]?.valorInadimplente * 0.15) },
    { category: '> 90 dias', percentage: 10, valor: Math.round(inadimplenciaData[inadimplenciaData.length - 1]?.valorInadimplente * 0.10) }
  ];

  const getAlertLevel = (rate: number) => {
    if (rate <= 3.0) return { level: 'success', text: 'Excelente controle' };
    if (rate <= 5.0) return { level: 'warning', text: 'Dentro do aceitável' };
    return { level: 'danger', text: 'Atenção necessária' };
  };

  const alertInfo = getAlertLevel(currentRate);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Inadimplência - {getUnitDisplayName(selectedUnit)}
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
                <CardTitle className="text-sm font-medium text-gray-600">Taxa Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold mb-1 ${
                  alertInfo.level === 'success' ? 'text-green-600' :
                  alertInfo.level === 'warning' ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {currentRate.toFixed(1)}%
                </div>
                <div className="flex items-center gap-1">
                  {rateChange < 0 ? (
                    <TrendingDown className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${rateChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {rateChange > 0 ? '+' : ''}{rateChange.toFixed(1)}pp vs anterior
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Meta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  3.0%
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span className={`text-sm ${currentRate <= 3.0 ? 'text-green-600' : 'text-red-600'}`}>
                    {currentRate <= 3.0 ? 'Meta atingida' : 'Acima da meta'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Valor Inadimplente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 mb-1">
                  R$ {inadimplenciaData[inadimplenciaData.length - 1]?.valorInadimplente.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">Total em atraso</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge 
                  variant={alertInfo.level === 'success' ? 'default' : 'destructive'}
                  className={`text-sm ${
                    alertInfo.level === 'success' ? 'bg-green-100 text-green-800' :
                    alertInfo.level === 'warning' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}
                >
                  {alertInfo.text}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Inadimplência Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Idade da Dívida</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inadimplenciaBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-orange-500' : 
                        index === 2 ? 'bg-red-500' : 'bg-red-700'
                      }`} />
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">R$ {item.valor.toLocaleString()}</div>
                      <Badge variant="secondary" className="text-xs">
                        {item.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Inadimplência Evolution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução da Taxa de Inadimplência</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={inadimplenciaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${Number(value).toFixed(1)}%`,
                        name === 'inadimplencia' ? 'Inadimplência' : 'Meta'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="inadimplencia" 
                      stroke="#F59E0B" 
                      strokeWidth={3}
                      dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
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

          {/* Valor Inadimplente Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Valor Inadimplente por Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={inadimplenciaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, 'Valor Inadimplente']}
                    />
                    <Bar dataKey="valorInadimplente" fill="#EF4444" />
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
        unit="%"
        onSave={handleSaveGoal}
        onReset={handleResetGoal}
        isUpdating={updating}
      />
    </Dialog>
  );
};
