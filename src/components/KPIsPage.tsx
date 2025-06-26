
import { Card } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Clock, Target, Percent } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const unitKPIs = [
  {
    unit: 'Campo Grande',
    cac: 125,
    crc: 89,
    ltv: 2850,
    ticketMedio: 380,
    retencao: 85,
    color: '#10B981'
  },
  {
    unit: 'Recreio',
    cac: 142,
    crc: 78,
    ltv: 2650,
    ticketMedio: 365,
    retencao: 82,
    color: '#3B82F6'
  },
  {
    unit: 'Barra',
    cac: 138,
    crc: 92,
    ltv: 2920,
    ticketMedio: 395,
    retencao: 88,
    color: '#F59E0B'
  },
  {
    unit: 'Botafogo',
    cac: 156,
    crc: 85,
    ltv: 2730,
    ticketMedio: 375,
    retencao: 83,
    color: '#EF4444'
  }
];

const evolutionData = [
  { month: 'Jan', cac: 145, ltv: 2650, ticketMedio: 360 },
  { month: 'Fev', cac: 142, ltv: 2720, ticketMedio: 365 },
  { month: 'Mar', cac: 138, ltv: 2780, ticketMedio: 370 },
  { month: 'Abr', cac: 135, ltv: 2850, ticketMedio: 375 },
  { month: 'Mai', cac: 132, ltv: 2890, ticketMedio: 380 },
  { month: 'Jun', cac: 140, ltv: 2850, ticketMedio: 378 }
];

export const KPIsPage = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">KPIs Estratégicos</h1>
          <p className="text-gray-600 mt-1">Indicadores de Performance por Unidade e Consolidado</p>
        </div>
        
        <div className="flex gap-2">
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

      {/* Consolidated KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700 font-medium">CAC Médio</p>
              <p className="text-2xl font-bold text-primary-900">R$ 140</p>
              <p className="text-xs text-primary-600">-3.5% vs anterior</p>
            </div>
            <DollarSign className="w-8 h-8 text-primary-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-success-50 to-success-100 border-success-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-success-700 font-medium">LTV Médio</p>
              <p className="text-2xl font-bold text-success-900">R$ 2.763</p>
              <p className="text-xs text-success-600">+5.2% vs anterior</p>
            </div>
            <TrendingUp className="w-8 h-8 text-success-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-warning-50 to-warning-100 border-warning-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-warning-700 font-medium">Ticket Médio</p>
              <p className="text-2xl font-bold text-warning-900">R$ 378</p>
              <p className="text-xs text-warning-600">+2.1% vs anterior</p>
            </div>
            <Target className="w-8 h-8 text-warning-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Retenção</p>
              <p className="text-2xl font-bold text-blue-900">84.5%</p>
              <p className="text-xs text-blue-600">+1.2% vs anterior</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-medium">CRC Médio</p>
              <p className="text-2xl font-bold text-purple-900">R$ 86</p>
              <p className="text-xs text-purple-600">-1.8% vs anterior</p>
            </div>
            <Percent className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* KPIs by Unit */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Performance por Unidade</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Unidade</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">CAC</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">CRC</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">LTV</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Ticket Médio</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Retenção</th>
              </tr>
            </thead>
            <tbody>
              {unitKPIs.map((unit, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: unit.color }}
                      />
                      <span className="font-medium">{unit.unit}</span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4">R$ {unit.cac}</td>
                  <td className="text-right py-3 px-4">R$ {unit.crc}</td>
                  <td className="text-right py-3 px-4">R$ {unit.ltv.toLocaleString()}</td>
                  <td className="text-right py-3 px-4">R$ {unit.ticketMedio}</td>
                  <td className="text-right py-3 px-4">{unit.retencao}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Evolution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Evolução CAC vs LTV</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cac" stroke="#EF4444" strokeWidth={2} name="CAC" />
              <Line type="monotone" dataKey="ltv" stroke="#10B981" strokeWidth={2} name="LTV" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Comparativo por Unidade - CAC</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={unitKPIs}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="unit" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cac" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Goals Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Metas vs Realizado</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>CAC Target: R$ 130</span>
              <span className="text-danger-600">R$ 140 (108%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-danger-500 h-2 rounded-full" style={{ width: '108%' }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>LTV Target: R$ 2.800</span>
              <span className="text-success-600">R$ 2.763 (99%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-success-500 h-2 rounded-full" style={{ width: '99%' }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Retenção Target: 85%</span>
              <span className="text-success-600">84.5% (99%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-warning-500 h-2 rounded-full" style={{ width: '99%' }} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
