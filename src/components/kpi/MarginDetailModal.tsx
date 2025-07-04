
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Percent, TrendingUp, TrendingDown, Target, AlertCircle } from 'lucide-react';
import { useUnit } from '@/contexts/UnitContext';
import { usePeriod } from '@/contexts/PeriodContext';
import { getMonthlyData } from '@/utils/dashboardData';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface MarginDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MarginDetailModal = ({ isOpen, onClose }: MarginDetailModalProps) => {
  const { selectedUnit, getUnitDisplayName } = useUnit();
  const { getDisplayPeriod } = usePeriod();
  const { data: monthlyData, isLoading: isMonthlyDataLoading } = useQuery({
    queryKey: ['monthlyData', selectedUnit],
    queryFn: () => getMonthlyData(selectedUnit),
  });

  if (isMonthlyDataLoading || !monthlyData) {
    return <div>Loading...</div>;
  }

  const currentMonth = monthlyData[monthlyData.length - 1] || {};
  const previousMonth = monthlyData[monthlyData.length - 2] || {};
  
  const currentMargin = (((currentMonth.receita || 0) - (currentMonth.despesa || 0)) / (currentMonth.receita || 1)) * 100;
  const previousMargin = (((previousMonth.receita || 0) - (previousMonth.despesa || 0)) / (previousMonth.receita || 1)) * 100;
  const marginChange = currentMargin - previousMargin;

  const chartData = monthlyData.map(item => ({
    month: item.month,
    margin: (((item.receita || 0) - (item.despesa || 0)) / (item.receita || 1)) * 100,
    target: 20 // Target margin of 20%
  }));

  const averageMargin = chartData.reduce((sum, item) => sum + item.margin, 0) / chartData.length;
  const bestMonth = chartData.reduce((max, current) => current.margin > max.margin ? current : max);
  const worstMonth = chartData.reduce((min, current) => current.margin < min.margin ? current : min);

  const getMarginStatus = (margin: number) => {
    if (margin >= 25) return { status: 'Excelente', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (margin >= 20) return { status: 'Boa', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (margin >= 15) return { status: 'Aceitável', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { status: 'Crítica', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const marginStatus = getMarginStatus(currentMargin);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-purple-600" />
            Margem Líquida - {getUnitDisplayName(selectedUnit)}
          </DialogTitle>
          <p className="text-sm text-gray-600">{getDisplayPeriod()}</p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Margem Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {currentMargin.toFixed(1)}%
                </div>
                <div className="flex items-center gap-1">
                  {marginChange > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${marginChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {marginChange > 0 ? '+' : ''}{marginChange.toFixed(1)}pp
                  </span>
                </div>
                <Badge className={`text-xs mt-1 ${marginStatus.bgColor} ${marginStatus.color}`}>
                  {marginStatus.status}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Meta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 mb-1">20.0%</div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-600">
                    {currentMargin >= 20 ? 'Atingida' : `Faltam ${(20 - currentMargin).toFixed(1)}pp`}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Média Período</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {averageMargin.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600">Últimos 6 meses</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Melhor Resultado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-green-600 mb-1">
                  {bestMonth.margin.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600">{bestMonth.month}</div>
              </CardContent>
            </Card>
          </div>

          {/* Margin Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução da Margem Líquida</CardTitle>
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
                        `${Number(value).toFixed(1)}%`,
                        name === 'margin' ? 'Margem' : 'Meta'
                      ]}
                    />
                    <ReferenceLine y={20} stroke="#3B82F6" strokeDasharray="8 8" label="Meta 20%" />
                    <Line 
                      type="monotone" 
                      dataKey="margin" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Cards */}
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
                      <div className="font-semibold text-green-600">
                        {bestMonth.month}: {bestMonth.margin.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pior Mês</span>
                    <div className="text-right">
                      <div className="font-semibold text-red-600">
                        {worstMonth.month}: {worstMonth.margin.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Variação</span>
                    <div className="text-right">
                      <div className="font-semibold">
                        {(bestMonth.margin - worstMonth.margin).toFixed(1)}pp
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tendência</span>
                    <div className="text-right">
                      <Badge variant={marginChange > 0 ? "default" : "destructive"}>
                        {marginChange > 0 ? 'Crescimento' : 'Declínio'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Recomendações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentMargin < 15 && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium">Revisar estrutura de custos</p>
                        <p className="text-xs text-gray-500">Margem abaixo do aceitável</p>
                      </div>
                    </div>
                  )}
                  {currentMargin < 20 && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium">Otimizar operações</p>
                        <p className="text-xs text-gray-500">Buscar eficiência operacional</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium">Aumentar receitas</p>
                      <p className="text-xs text-gray-500">Focar em crescimento de vendas</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium">Controlar despesas</p>
                      <p className="text-xs text-gray-500">Manter disciplina financeira</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
