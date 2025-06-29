
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
         BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, 
         PolarRadiusAxis, Radar } from 'recharts';
import { getHistoricalDataByUnit } from '@/utils/unitData';
import { useUnit } from '@/contexts/UnitContext';
import { usePeriod } from '@/contexts/PeriodContext';
import { useMemo } from 'react';

interface StrategicChartsProps {
  onChartClick: (chartType: string) => void;
}

export const StrategicCharts = ({ onChartClick }: StrategicChartsProps) => {
  const { selectedUnit } = useUnit();
  const { periodFilter } = usePeriod();
  
  // Revenue vs Churn timeline data
  const revenueChurnData = useMemo(() => {
    const historicalData = getHistoricalDataByUnit(selectedUnit);
    
    return historicalData.map((item, index) => ({
      month: item.month,
      receita: item.receita,
      churnFinanceiro: 3.5 - (index * 0.1) // Simulação de melhora no churn
    }));
  }, [selectedUnit]);
  
  // LTV/CAC comparison data
  const ltvCacData = useMemo(() => {
    const units = selectedUnit === 'all' 
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
    
    return units;
  }, [selectedUnit]);
  
  // Efficiency radar data
  const efficiencyData = useMemo(() => {
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
      // Média consolidada
      return [
        { metric: 'Margem Líquida', value: 86, fullMark: 100 },
        { metric: 'Ocupação', value: 36, fullMark: 100 },
        { metric: 'Retenção', value: 88, fullMark: 100 },
        { metric: 'Produtividade', value: 82, fullMark: 100 },
        { metric: 'Eficiência CAC', value: 92, fullMark: 100 }
      ];
    }
    
    return baseData[selectedUnit as keyof typeof baseData] || baseData['campo-grande'];
  }, [selectedUnit]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue vs Churn Timeline */}
      <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" 
            onClick={() => onChartClick('revenue-churn')}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Receita vs Churn Financeiro</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={revenueChurnData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Line yAxisId="left" type="monotone" dataKey="receita" stroke="#10B981" strokeWidth={3} 
                  name="Receita" />
            <Line yAxisId="right" type="monotone" dataKey="churnFinanceiro" stroke="#EF4444" strokeWidth={3} 
                  name="Churn %" />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-500 mt-2 text-center">Clique para análise detalhada</p>
      </Card>

      {/* LTV vs CAC Comparison */}
      <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" 
            onClick={() => onChartClick('ltv-cac')}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">LTV vs CAC por Unidade</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={ltvCacData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="unit" />
            <YAxis />
            <Tooltip formatter={(value) => [`R$ ${(value as number).toLocaleString()}`, '']} />
            <Bar dataKey="ltv" fill="#3B82F6" name="LTV" />
            <Bar dataKey="cac" fill="#F59E0B" name="CAC" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-500 mt-2 text-center">Clique para análise detalhada</p>
      </Card>

      {/* Efficiency Radar */}
      <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" 
            onClick={() => onChartClick('efficiency-radar')}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Radar de Eficiência</h3>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={efficiencyData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
            <Radar name="Eficiência" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-500 mt-2 text-center">Clique para análise detalhada</p>
      </Card>

      {/* Strategic Alerts */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Alertas Estratégicos</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-sm font-medium text-red-800">Ocupação Baixa</p>
              <p className="text-xs text-red-600">
                {selectedUnit === 'all' ? 'Média de ocupação: 36%' : 'Revisar estratégia de captação'}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-sm font-medium text-yellow-800">Churn em Atenção</p>
              <p className="text-xs text-yellow-600">Monitorar taxa de cancelamentos</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-sm font-medium text-green-800">Margem Saudável</p>
              <p className="text-xs text-green-600">Rentabilidade dentro do esperado</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
