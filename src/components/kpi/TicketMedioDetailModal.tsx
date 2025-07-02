
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Receipt, Target, Calendar, Settings } from 'lucide-react';
import { useUnit } from '@/contexts/UnitContext';
import { usePeriod } from '@/contexts/PeriodContext';
import { getHistoricalDataByUnit } from '@/utils/unitData';
import { useKPIGoals } from '@/hooks/useKPIGoals';
import { EditGoalModal } from './EditGoalModal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useState } from 'react';

interface TicketMedioDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TicketMedioDetailModal = ({ isOpen, onClose }: TicketMedioDetailModalProps) => {
  const { selectedUnit, getUnitDisplayName } = useUnit();
  const { periodFilter, getDisplayPeriod } = usePeriod();
  const historicalData = getHistoricalDataByUnit(selectedUnit);
  const { getGoal, updateGoal, resetToDefault, updating } = useKPIGoals(selectedUnit);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const kpiName = 'Ticket Médio';
  const currentGoal = getGoal(kpiName);

  const handleSaveGoal = async (newGoal: number) => {
    return await updateGoal(kpiName, newGoal);
  };

  const handleResetGoal = async () => {
    return await resetToDefault(kpiName);
  };

  // Calculate ticket médio evolution
  const ticketData = historicalData.map(item => ({
    month: item.month,
    ticketMedio: Math.round(item.receita / (item.alunos || 400)),
    meta: 320
  }));

  const currentTicket = ticketData[ticketData.length - 1]?.ticketMedio || 0;
  const previousTicket = ticketData[ticketData.length - 2]?.ticketMedio || 0;
  const ticketChange = ((currentTicket - previousTicket) / previousTicket) * 100;

  // Ticket breakdown by category
  const ticketBreakdown = [
    { category: 'Mensalidade Base', value: Math.round(currentTicket * 0.75), percentage: 75 },
    { category: 'Serviços Extras', value: Math.round(currentTicket * 0.15), percentage: 15 },
    { category: 'Taxas', value: Math.round(currentTicket * 0.10), percentage: 10 }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-600" />
                Ticket Médio - {getUnitDisplayName(selectedUnit)}
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
                <CardTitle className="text-sm font-medium text-gray-600">Ticket Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  R$ {currentTicket}
                </div>
                <div className="flex items-center gap-1">
                  {ticketChange > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${ticketChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {ticketChange > 0 ? '+' : ''}{ticketChange.toFixed(1)}% vs anterior
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Meta Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  R$ 320
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">
                    {((currentTicket / 320) * 100).toFixed(1)}% atingido
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
                  R$ {Math.round(currentTicket * 1.03)}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-purple-600">Próximo mês</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ticket Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Composição do Ticket Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ticketBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-500' : 
                        index === 1 ? 'bg-green-500' : 'bg-purple-500'
                      }`} />
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">R$ {item.value}</div>
                      <Badge variant="secondary" className="text-xs">
                        {item.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ticket Evolution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução do Ticket Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ticketData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        `R$ ${Number(value)}`,
                        name === 'ticketMedio' ? 'Ticket Médio' : 'Meta'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ticketMedio" 
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
