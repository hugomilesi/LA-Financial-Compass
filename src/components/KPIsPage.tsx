import { Card } from '@/components/ui/card';
import { DollarSign, TrendingUp, Clock, TrendingDown, CreditCard } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getKPIsByUnit, getHistoricalDataByUnit, KPIData } from '@/utils/kpiData';
import { KPIDetailModal } from './KPIDetailModal';
import { CustomTooltip } from './kpi/CustomTooltip';
import { StrategicTooltip } from './kpi/StrategicTooltip';
import { useState, useEffect } from 'react';
import { useUnit } from '@/contexts/UnitContext';

const iconMap = {
  DollarSign,
  TrendingUp,
  Clock,
  TrendingDown,
  CreditCard
};

export const KPIsPage = () => {
  const { selectedUnit, setSelectedUnit, getUnitDisplayName } = useUnit();
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);
  const [kpis, setKpis] = useState<KPIData[]>([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [comparisonData, setComparisonData] = useState<Record<string, KPIData[]>>({});

  useEffect(() => {
    const fetchData = async () => {
      const [kpisData, historical] = await Promise.all([
        getKPIsByUnit(selectedUnit),
        getHistoricalDataByUnit(selectedUnit)
      ]);
      setKpis(kpisData);
      setHistoricalData(historical);
    };
    fetchData();
  }, [selectedUnit]);

  useEffect(() => {
    const fetchComparisonData = async () => {
      const units = ['campo-grande', 'recreio', 'barra'];
      const data = await Promise.all(units.map(unitId => getKPIsByUnit(unitId)));
      const comparison = units.reduce((acc, unitId, index) => {
        acc[unitId] = data[index];
        return acc;
      }, {} as Record<string, KPIData[]>);
      setComparisonData(comparison);
    };
    fetchComparisonData();
  }, []);
  
  const handleKPIClick = (kpiId: string) => {
    setSelectedKPI(kpiId);
  };
  
  const handleCloseModal = () => {
    setSelectedKPI(null);
  };

  const handleExportReport = () => {
    // TODO: Implementar exportação de PDF incluindo os novos gráficos
    console.log('Exportando relatório com gráficos atualizados...');
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">KPIs Estratégicos</h1>
          <p className="text-gray-600 mt-1">Indicadores de Performance - {getUnitDisplayName(selectedUnit)}</p>
        </div>
        
        <div className="flex gap-2">
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
          >
            <option value="all">Todas as Unidades</option>
            <option value="campo-grande">Campo Grande</option>
            <option value="recreio">Recreio</option>
            <option value="barra">Barra</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>Junho 2024</option>
            <option>Maio 2024</option>
            <option>Abril 2024</option>
          </select>
          <button 
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            onClick={handleExportReport}
          >
            Exportar Relatório
          </button>
        </div>
      </div>

      {/* Main KPIs - 5 cards in responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => {
          const IconComponent = iconMap[kpi.icon as keyof typeof iconMap] || DollarSign;
          const changeColor = kpi.change > 0 ? 'text-green-600' : kpi.change < 0 ? 'text-red-600' : 'text-gray-600';
          
          return (
            <Card 
              key={kpi.id} 
              className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => handleKPIClick(kpi.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  {kpi.change !== 0 && (
                    <p className={`text-xs ${changeColor} font-medium`}>
                      {kpi.change > 0 ? '+' : ''}{kpi.change.toFixed(1)}% vs anterior
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <IconComponent 
                    className="w-8 h-8"
                    style={{ color: kpi.color }}
                  />
                  <div className="text-xs text-gray-400 font-medium">
                    Clique para detalhes
                  </div>
                </div>
              </div>
              <div 
                className="w-full h-1 rounded-full"
                style={{ backgroundColor: `${kpi.color}20` }}
              >
                <div 
                  className="h-1 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: kpi.color,
                    width: '75%' // Placeholder progress
                  }}
                />
              </div>
            </Card>
          );
        })}
      </div>

      {/* New Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CAC vs LTV Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Relação CAC vs LTV</h3>
            <StrategicTooltip type="ltv-cac" data={historicalData} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <Tooltip 
                content={<CustomTooltip type="ltv-cac" />}
              />
              <Line 
                type="monotone" 
                dataKey="cac" 
                stroke="#EF4444" 
                strokeWidth={3} 
                name="CAC"
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#EF4444' }}
              />
              <Line 
                type="monotone" 
                dataKey="ltv" 
                stroke="#10B981" 
                strokeWidth={3} 
                name="LTV"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#10B981' }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-600">CAC</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600">LTV</span>
            </div>
          </div>
        </Card>

        {/* CRC vs Churn Rate Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">CRC vs Taxa de Churn</h3>
            <StrategicTooltip type="crc-churn" data={historicalData} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <Tooltip 
                content={<CustomTooltip type="crc-churn" />}
              />
              <Line 
                type="monotone" 
                dataKey="crc" 
                stroke="#8B5CF6" 
                strokeWidth={3} 
                name="CRC"
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#8B5CF6' }}
              />
              <Line 
                type="monotone" 
                dataKey="churnRate" 
                stroke="#F59E0B" 
                strokeWidth={3} 
                name="Churn Rate"
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#F59E0B' }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-gray-600">CRC</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-gray-600">Churn Rate</span>
            </div>
          </div>
        </Card>
      </div>

      {/* KPI Comparison Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Comparativo por Unidade</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Unidade</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">CAC</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">CRC</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">LTV</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Churn Rate</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Permanência</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(comparisonData).map(([unitId, unitKPIs]) => {
                const unitName = getUnitDisplayName(unitId);
                return (
                  <tr key={unitId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-medium">{unitName}</span>
                    </td>
                    <td className="text-right py-3 px-4">{unitKPIs.find(k => k.id === 'cac')?.value || 'N/A'}</td>
                    <td className="text-right py-3 px-4">{unitKPIs.find(k => k.id === 'crc')?.value || 'N/A'}</td>
                    <td className="text-right py-3 px-4">{unitKPIs.find(k => k.id === 'ltv')?.value || 'N/A'}</td>
                    <td className="text-right py-3 px-4">{unitKPIs.find(k => k.id === 'churn-rate')?.value || 'N/A'}</td>
                    <td className="text-right py-3 px-4">{unitKPIs.find(k => k.id === 'tempo-de-permanencia')?.value || 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* KPI Detail Modal */}
      <KPIDetailModal
        isOpen={!!selectedKPI}
        onClose={handleCloseModal}
        kpiId={selectedKPI}
        unitId={selectedUnit}
      />
    </div>
  );
};