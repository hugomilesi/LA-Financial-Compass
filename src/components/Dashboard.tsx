
import { KPICard } from './KPICard';
import { AIInsights } from './AIInsights';
import { DollarSign, Users, TrendingUp, Percent, Target, Calendar, CreditCard, Receipt } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Calculate KPI values from monthly data
const monthlyData = [
  { month: 'Jan', receita: 220000, despesa: 180000 },
  { month: 'Fev', receita: 235000, despesa: 185000 },
  { month: 'Mar', receita: 245000, despesa: 190000 },
  { month: 'Abr', receita: 238000, despesa: 188000 },
  { month: 'Mai', receita: 260000, despesa: 195000 },
  { month: 'Jun', receita: 245780, despesa: 192000 }
];

const currentMonth = monthlyData[monthlyData.length - 1];
const previousMonth = monthlyData[monthlyData.length - 2];

const totalRevenue = currentMonth.receita;
const totalExpenses = currentMonth.despesa;
const cashGeneration = totalRevenue - totalExpenses;
const netMargin = ((cashGeneration / totalRevenue) * 100);

const previousCashGeneration = previousMonth.receita - previousMonth.despesa;
const previousNetMargin = ((previousCashGeneration / previousMonth.receita) * 100);

// Calculate Average Ticket (Ticket Médio)
const currentActiveStudents = 1247;
const previousActiveStudents = 1113; // Previous month students (12.1% increase)
const averageTicket = totalRevenue / currentActiveStudents;
const previousAverageTicket = previousMonth.receita / previousActiveStudents;

// Primary KPIs for the top section
const primaryKPIs = [
  {
    title: 'Receita Total',
    value: `R$ ${totalRevenue.toLocaleString()}`,
    change: ((totalRevenue - previousMonth.receita) / previousMonth.receita) * 100,
    target: 85,
    icon: DollarSign,
    alert: 'success' as const
  },
  {
    title: 'Despesa Total',
    value: `R$ ${totalExpenses.toLocaleString()}`,
    change: ((totalExpenses - previousMonth.despesa) / previousMonth.despesa) * 100,
    target: 75,
    icon: CreditCard,
    alert: 'warning' as const
  },
  {
    title: 'Geração de Caixa',
    value: `R$ ${cashGeneration.toLocaleString()}`,
    change: ((cashGeneration - previousCashGeneration) / previousCashGeneration) * 100,
    target: 65,
    icon: TrendingUp,
    alert: cashGeneration > previousCashGeneration ? 'success' as const : 'warning' as const
  },
  {
    title: 'Margem Líquida',
    value: `${netMargin.toFixed(1)}%`,
    change: netMargin - previousNetMargin,
    target: 40,
    icon: Percent,
    alert: netMargin > previousNetMargin ? 'success' as const : 'danger' as const
  }
];

// Secondary KPIs for additional metrics - now includes Ticket Médio
const secondaryKPIs = [
  {
    title: 'Ticket Médio',
    value: `R$ ${Math.round(averageTicket)}`,
    change: ((averageTicket - previousAverageTicket) / previousAverageTicket) * 100,
    target: 75,
    icon: Receipt,
    alert: averageTicket > previousAverageTicket ? 'success' as const : 'warning' as const
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
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] border-none shadow-none">
              <SelectValue placeholder="Selecionar unidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Unidades</SelectItem>
              <SelectItem value="campo-grande">Campo Grande</SelectItem>
              <SelectItem value="recreio">Recreio</SelectItem>
              <SelectItem value="barra">Barra</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Primary KPIs - Top 4 metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {primaryKPIs.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Secondary KPIs - Additional metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {secondaryKPIs.map((kpi, index) => (
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
