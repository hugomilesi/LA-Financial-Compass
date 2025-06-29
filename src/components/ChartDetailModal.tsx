
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { getMonthlyData, getCostCenterData, getCostCenterDetailData } from '@/utils/dashboardData';
import { useReports, Report } from '@/hooks/useReports';
import { FileText } from 'lucide-react';
import { useUnit } from '@/contexts/UnitContext';
import { usePeriod } from '@/contexts/PeriodContext';

interface ChartDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  chartType: 'revenue' | 'cost-center' | null;
  onReportClick?: (report: Report) => void;
}

export const ChartDetailModal = ({ isOpen, onClose, chartType, onReportClick }: ChartDetailModalProps) => {
  const { getRelatedReports } = useReports();
  const { selectedUnit, getUnitDisplayName } = useUnit();
  const { periodFilter, getDisplayPeriod } = usePeriod();

  if (!chartType) return null;

  const getContextKey = (type: string) => {
    switch (type) {
      case 'revenue': return 'revenue-chart';
      case 'cost-center': return 'cost-center-chart';
      default: return 'revenue-chart';
    }
  };

  const relatedReports = getRelatedReports(getContextKey(chartType));

  // Get dynamic data based on selected unit and period
  const costCenterData = getCostCenterData(selectedUnit, periodFilter);
  const costCenterDetailData = getCostCenterDetailData(selectedUnit, periodFilter);
  const monthlyData = getMonthlyData(selectedUnit, periodFilter);

  // Calculate current period totals from monthly data
  const currentMonth = monthlyData[monthlyData.length - 1];
  const totalRevenue = currentMonth?.receita || 0;
  const totalExpenses = currentMonth?.despesa || 0;
  const profit = totalRevenue - totalExpenses;

  const getModalContent = () => {
    switch (chartType) {
      case 'revenue':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">R$ {totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Receita Total</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">R$ {totalExpenses.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Despesa Total</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">R$ {profit.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Lucro Líquido</div>
              </Card>
            </div>

            <Card className="p-4">
              <h4 className="text-lg font-semibold mb-4">Evolução Mensal Detalhada</h4>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${(value as number).toLocaleString()}`, '']} />
                  <Line dataKey="receita" stroke="#10B981" name="Receita" strokeWidth={2} />
                  <Line dataKey="despesa" stroke="#EF4444" name="Despesa" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="font-semibold mb-2">Principais Receitas</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Mensalidades</span>
                    <span>R$ {Math.round(totalRevenue * 0.796).toLocaleString()} (79.6%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Matrículas</span>
                    <span>R$ {Math.round(totalRevenue * 0.132).toLocaleString()} (13.2%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uniformes/Material</span>
                    <span>R$ {Math.round(totalRevenue * 0.072).toLocaleString()} (7.2%)</span>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold mb-2">Principais Despesas</h4>
                <div className="space-y-2 text-sm">
                  {costCenterDetailData.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.categoria}</span>
                      <span>R$ {item.valor.toLocaleString()} ({item.percentual.toFixed(1)}%)</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Related Reports */}
            {onReportClick && (
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Relatórios Relacionados</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {relatedReports.map((report) => (
                    <button
                      key={report.id}
                      onClick={() => onReportClick(report)}
                      className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-primary-600 mb-1" />
                      <p className="text-sm font-medium text-gray-900">{report.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{report.period}</p>
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </div>
        );

      case 'cost-center':
        return (
          <div className="space-y-6">
            <Card className="p-4">
              <h4 className="text-lg font-semibold mb-4">Distribuição Detalhada por Centro de Custos - {getUnitDisplayName(selectedUnit)}</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={costCenterData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {costCenterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              {costCenterDetailData.map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{item.categoria}</h4>
                      <p className="text-sm text-gray-600">{item.percentual.toFixed(1)}% do total</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">R$ {item.valor.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">{getDisplayPeriod()}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-4">
              <h4 className="font-semibold mb-4">Análise Comparativa</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-2">Vs. Mês Anterior</h5>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Pessoal:</span>
                      <span className="text-red-600">+2,4%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Aluguel:</span>
                      <span className="text-gray-600">0%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marketing:</span>
                      <span className="text-green-600">-1,2%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Vs. Meta</h5>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Pessoal:</span>
                      <span className="text-red-600">+3,3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Aluguel:</span>
                      <span className="text-green-600">-0,8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marketing:</span>
                      <span className="text-green-600">-2,5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Related Reports */}
            {onReportClick && (
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Relatórios Relacionados</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {relatedReports.map((report) => (
                    <button
                      key={report.id}
                      onClick={() => onReportClick(report)}
                      className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-primary-600 mb-1" />
                      <p className="text-sm font-medium text-gray-900">{report.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{report.period}</p>
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (chartType) {
      case 'revenue':
        return `Análise Detalhada - Receita vs Despesa - ${getUnitDisplayName(selectedUnit)} - ${getDisplayPeriod()}`;
      case 'cost-center':
        return `Análise Detalhada - Centro de Custos - ${getUnitDisplayName(selectedUnit)} - ${getDisplayPeriod()}`;
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getModalTitle()}</DialogTitle>
        </DialogHeader>
        {getModalContent()}
      </DialogContent>
    </Dialog>
  );
};
