
import { KPICard } from './KPICard';
import { AIInsights } from './AIInsights';
import { DollarSign, Users, TrendingUp, Percent, Target, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const kpiData = [
  {
    title: 'Receita Total',
    value: 'R$ 245.780',
    change: 8.2,
    target: 85,
    icon: DollarSign,
    alert: 'success' as const
  },
  {
    title: 'Geração de Caixa',
    value: 'R$ 89.450',
    change: -3.1,
    target: 65,
    icon: TrendingUp,
    alert: 'warning' as const
  },
  {
    title: 'Margem Líquida',
    value: '22.5%',
    change: -5.8,
    target: 40,
    icon: Percent,
    alert: 'danger' as const
  },
  {
    title: 'Despesa Pessoal',
    value: '58.3%',
    change: 2.4,
    target: 95,
    icon: Users,
    alert: 'warning' as const
  },
  {
    title: 'Alunos Ativos',
    value: '1.247',
    change: 12.1,
    target: 90,
    icon: Users,
    alert: 'success' as const
  },
  {
    title: 'Metas Batidas',
    value: '7/12',
    change: 0,
    target: 58,
    icon: Target,
    alert: 'warning' as const
  }
];

const monthlyData = [
  { month: 'Jan', receita: 220000, despesa: 180000 },
  { month: 'Fev', receita: 235000, despesa: 185000 },
  { month: 'Mar', receita: 245000, despesa: 190000 },
  { month: 'Abr', receita: 238000, despesa: 188000 },
  { month: 'Mai', receita: 260000, despesa: 195000 },
  { month: 'Jun', receita: 245780, despesa: 192000 }
];

const costCenterData = [
  { name: 'Pessoal', value: 58.3, color: '#EF4444' },
  { name: 'Aluguel', value: 18.2, color: '#F59E0B' },
  { name: 'Marketing', value: 12.5, color: '#10B981' },
  { name: 'Operacional', value: 8.7, color: '#3B82F6' },
  { name: 'Outros', value: 2.3, color: '#6B7280' }
];

export const Dashboard = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Financeiro</h1>
          <p className="text-gray-600 mt-1">Visão estratégica consolidada - Junho 2024</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
          <Calendar className="w-4 h-4 text-gray-500" />
          <select className="border-none outline-none text-sm">
            <option>Todas as Unidades</option>
            <option>Campo Grande</option>
            <option>Recreio</option>
            <option>Barra</option>
            <option>Botafogo</option>
          </select>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Evolution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Evolução Receita vs Despesa</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`R$ ${(value as number).toLocaleString()}`, '']} />
              <Bar dataKey="receita" fill="#10B981" name="Receita" />
              <Bar dataKey="despesa" fill="#EF4444" name="Despesa" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Cost Center Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Distribuição Centro de Custos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costCenterData}
                cx="50%"
                cy="50%"
                outerRadius={100}
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
      </div>

      {/* AI Insights */}
      <AIInsights />

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="p-4 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors">
            <DollarSign className="w-6 h-6 text-primary-600 mb-2" />
            <p className="text-sm font-medium text-primary-700">Exportar DRE</p>
          </button>
          <button className="p-4 bg-success-50 border border-success-200 rounded-lg hover:bg-success-100 transition-colors">
            <Target className="w-6 h-6 text-success-600 mb-2" />
            <p className="text-sm font-medium text-success-700">Definir Metas</p>
          </button>
          <button className="p-4 bg-warning-50 border border-warning-200 rounded-lg hover:bg-warning-100 transition-colors">
            <TrendingUp className="w-6 h-6 text-warning-600 mb-2" />
            <p className="text-sm font-medium text-warning-700">Ver Relatórios</p>
          </button>
          <button className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
            <Users className="w-6 h-6 text-gray-600 mb-2" />
            <p className="text-sm font-medium text-gray-700">Análise Unidades</p>
          </button>
        </div>
      </Card>
    </div>
  );
};
