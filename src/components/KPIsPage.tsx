
import { Card } from '@/components/ui/card';
import { DollarSign, CreditCard, TrendingUp, Clock, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getKPIsByUnit } from '@/utils/kpiData';
import { KPIDetailModal } from './KPIDetailModal';
import { useState } from 'react';
import { useUnit } from '@/contexts/UnitContext';

const evolutionData = [
  { month: 'Jan', cac: 145, ltv: 2650, ltvCacRatio: 18.3 },
  { month: 'Fev', cac: 142, ltv: 2720, ltvCacRatio: 19.2 },
  { month: 'Mar', cac: 138, ltv: 2780, ltvCacRatio: 20.1 },
  { month: 'Abr', cac: 135, ltv: 2850, ltvCacRatio: 21.1 },
  { month: 'Mai', cac: 132, ltv: 2890, ltvCacRatio: 21.9 },
  { month: 'Jun', cac: 140, ltv: 2850, ltvCacRatio: 20.4 }
];

const iconMap = {
  DollarSign,
  CreditCard,
  TrendingUp,
  Clock,
  Target
};

export const KPIsPage = () => {
  const { selectedUnit, setSelectedUnit, getUnitDisplayName } = useUnit();
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);
  
  const kpis = getKPIsByUnit(selectedUnit);
  
  const handleKPIClick = (kpiId: string) => {
    setSelectedKPI(kpiId);
  };
  
  const handleCloseModal = () => {
    setSelectedKPI(null);
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
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Exportar Relatório
          </button>
        </div>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => {
          const IconComponent = iconMap[kpi.icon as keyof typeof iconMap];
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

      {/* Evolution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Evolução CAC vs LTV</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`R$ ${(value as number).toLocaleString()}`, '']} />
              <Line type="monotone" dataKey="cac" stroke="#EF4444" strokeWidth={2} name="CAC" />
              <Line type="monotone" dataKey="ltv" stroke="#10B981" strokeWidth={2} name="LTV" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Evolução LTV/CAC Ratio</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${(value as number).toFixed(1)}x`, 'LTV/CAC']} />
              <Bar dataKey="ltvCacRatio" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
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
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Permanência</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">LTV/CAC</th>
              </tr>
            </thead>
            <tbody>
              {['campo-grande', 'recreio', 'barra'].map((unitId) => {
                const unitKPIs = getKPIsByUnit(unitId);
                const unitName = getUnitDisplayName(unitId);
                
                return (
                  <tr key={unitId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-medium">{unitName}</span>
                    </td>
                    <td className="text-right py-3 px-4">{unitKPIs[0].value}</td>
                    <td className="text-right py-3 px-4">{unitKPIs[1].value}</td>
                    <td className="text-right py-3 px-4">{unitKPIs[2].value}</td>
                    <td className="text-right py-3 px-4">{unitKPIs[3].value}</td>
                    <td className="text-right py-3 px-4">{unitKPIs[4].value}</td>
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
