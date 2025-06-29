import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { getMonthlyData, getCostCenterData, getCostCenterDetailData } from '@/utils/dashboardData';
import { getHistoricalDataByUnit } from '@/utils/unitData';
import { useReports, Report } from '@/hooks/useReports';
import { FileText } from 'lucide-react';
import { useUnit } from '@/contexts/UnitContext';

interface ChartDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  chartType: 'revenue' | 'cost-center' | 'revenue-churn' | 'ltv-cac' | 'efficiency-radar' | null;
  onReportClick?: (report: Report) => void;
}

export const ChartDetailModal = ({ isOpen, onClose, chartType, onReportClick }: ChartDetailModalProps) => {
  const { getRelatedReports } = useReports();
  const { selectedUnit, getUnitDisplayName } = useUnit();

  if (!chartType) return null;

  const getContextKey = (type: string) => {
    switch (type) {
      case 'revenue': return 'revenue-chart';
      case 'cost-center': return 'cost-center-chart';
      case 'revenue-churn': return 'revenue-churn-chart';
      case 'ltv-cac': return 'ltv-cac-chart';
      case 'efficiency-radar': return 'efficiency-radar-chart';
      default: return 'revenue-chart';
    }
  };

  const relatedReports = getRelatedReports(getContextKey(chartType));

  // Get dynamic data based on selected unit
  const costCenterData = getCostCenterData(selectedUnit);
  const costCenterDetailData = getCostCenterDetailData(selectedUnit);
  const monthlyData = getMonthlyData(selectedUnit);
  const historicalData = getHistoricalDataByUnit(selectedUnit);

  // Calculate current month totals from monthly data
  const currentMonth = monthlyData[monthlyData.length - 1];
  const totalRevenue = currentMonth?.receita || 0;
  const totalExpenses = currentMonth?.despesa || 0;
  const profit = totalRevenue - totalExpenses;

  // Revenue vs Churn timeline data
  const revenueChurnData = historicalData.map((item, index) => ({
    month: item.month,
    receita: item.receita,
    churnFinanceiro: 3.5 - (index * 0.1)
  }));

  // LTV/CAC comparison data
  const ltvCacData = selectedUnit === 'all' 
    ? [
        { unit: 'Campo Grande', ltv: 2850, cac: 125 },
        { unit: 'Recreio', ltv: 2650, cac: 142 },
        { unit: 'Barra', ltv: 2920, cac: 138 }
      ]
    : [
        { 
          unit: selectedUnit === 'campo-grande' ? 'Campo Grande' : 
                selectedUnit === 'recreio' ? 'Recreio' : 'Barra',
          ltv: selectedUnit === 'campo-grande' ? 2850 : 
               selectedUnit === 'recreio' ? 2650 : 2920,
          cac: selectedUnit === 'campo-grande' ? 125 : 
               selectedUnit === 'recreio' ? 142 : 138
        }
      ];

  // Efficiency radar data
  const efficiencyData = (() => {
    const baseData = {
      'campo-grande': [
        { metric: 'Margem Líquida', value: 85, fullMark: 100 },
        { metric: 'Ocupação', value: 49, fullMark: 100 },
        { metric: 'Retenção', value: 88, fullMark: 100 },
        { metric: 'Produtividade', value: 78, fullMark: 100 },
        { metric: 'Eficiência CAC', value: 92, fullMark: 100 }
      ],
      'recreio': [
        { metric: 'Margem Líquida', value: 82, fullMark: 100 },
        { metric: 'Ocupação', value: 36, fullMark: 100 },
        { metric: 'Retenção', value: 85, fullMark: 100 },
        { metric: 'Produtividade', value: 82, fullMark: 100 },
        { metric: 'Eficiência CAC', value: 88, fullMark: 100 }
      ],
      'barra': [
        { metric: 'Margem Líquida', value: 90, fullMark: 100 },
        { metric: 'Ocupação', value: 22, fullMark: 100 },
        { metric: 'Retenção', value: 90, fullMark: 100 },
        { metric: 'Produtividade', value: 85, fullMark: 100 },
        { metric: 'Eficiência CAC', value: 95, fullMark: 100 }
      ]
    };
    
    if (selectedUnit === 'all') {
      return [
        { metric: 'Margem Líquida', value: 86, fullMark: 100 },
        { metric: 'Ocupação', value: 36, fullMark: 100 },
        { metric: 'Retenção', value: 88, fullMark: 100 },
        { metric: 'Produtividade', value: 82, fullMark: 100 },
        { metric: 'Eficiência CAC', value: 92, fullMark: 100 }
      ];
    }
    
    return baseData[selectedUnit as keyof typeof baseData] || baseData['campo-grande'];
  })();

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
                      <div className="text-sm text-gray-600">Junho 2024</div>
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

      case 'revenue-churn':
        return (
          <div className="space-y-6">
            <Card className="p-4">
              <h4 className="text-lg font-semibold mb-4">Análise Receita vs Churn Financeiro</h4>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueChurnData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="receita" stroke="#10B981" strokeWidth={3} 
                        name="Receita (R$)" />
                  <Line yAxisId="right" type="monotone" dataKey="churnFinanceiro" stroke="#EF4444" strokeWidth={3} 
                        name="Churn (%)" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="font-semibold mb-2">Insights do Churn</h4>
                <div className="space-y-2 text-sm">
                  <p>• Churn financeiro em tendência de queda</p>
                  <p>• Correlação inversa com crescimento da receita</p>
                  <p>• Melhoria nas estratégias de retenção</p>
                </div>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold mb-2">Ações Recomendadas</h4>
                <div className="space-y-2 text-sm">
                  <p>• Continuar programas de fidelização</p>
                  <p>• Monitorar sinais de insatisfação</p>
                  <p>• Implementar pesquisas de satisfação</p>
                </div>
              </Card>
            </div>
          </div>
        );

      case 'ltv-cac':
        return (
          <div className="space-y-6">
            <Card className="p-4">
              <h4 className="text-lg font-semibold mb-4">Análise LTV vs CAC por Unidade</h4>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={ltvCacData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="unit" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${(value as number).toLocaleString()}`, '']} />
                  <Bar dataKey="ltv" fill="#3B82F6" name="LTV" />
                  <Bar dataKey="cac" fill="#F59E0B" name="CAC" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              {ltvCacData.map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{item.unit}</h4>
                      <p className="text-sm text-gray-600">Ratio LTV/CAC: {(item.ltv / item.cac).toFixed(1)}x</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">LTV: R$ {item.ltv.toLocaleString()}</div>
                      <div className="text-sm">CAC: R$ {item.cac.toLocaleString()}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'efficiency-radar':
        return (
          <div className="space-y-6">
            <Card className="p-4">
              <h4 className="text-lg font-semibold mb-4">Radar de Eficiência - {getUnitDisplayName(selectedUnit)}</h4>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={efficiencyData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                  <Radar name="Eficiência" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              {efficiencyData.map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{item.metric}</h4>
                      <p className="text-sm text-gray-600">Pontuação atual</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">{item.value}/100</div>
                      <div className={`text-sm ${item.value >= 80 ? 'text-green-600' : item.value >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {item.value >= 80 ? 'Excelente' : item.value >= 60 ? 'Bom' : 'Precisa melhorar'}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (chartType) {
      case 'revenue':
        return `Análise Detalhada - Receita vs Despesa - ${getUnitDisplayName(selectedUnit)}`;
      case 'cost-center':
        return `Análise Detalhada - Centro de Custos - ${getUnitDisplayName(selectedUnit)}`;
      case 'revenue-churn':
        return `Análise Detalhada - Receita vs Churn - ${getUnitDisplayName(selectedUnit)}`;
      case 'ltv-cac':
        return `Análise Detalhada - LTV vs CAC - ${getUnitDisplayName(selectedUnit)}`;
      case 'efficiency-radar':
        return `Análise Detalhada - Radar de Eficiência - ${getUnitDisplayName(selectedUnit)}`;
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
