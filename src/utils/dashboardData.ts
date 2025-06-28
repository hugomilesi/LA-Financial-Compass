
// Dashboard data calculations and static data
export const monthlyData = [
  { month: 'Jan', receita: 220000, despesa: 180000 },
  { month: 'Fev', receita: 235000, despesa: 185000 },
  { month: 'Mar', receita: 245000, despesa: 190000 },
  { month: 'Abr', receita: 238000, despesa: 188000 },
  { month: 'Mai', receita: 260000, despesa: 195000 },
  { month: 'Jun', receita: 245780, despesa: 192000 }
];

export const costCenterData = [
  { name: 'Pessoal', value: 58.3, color: '#EF4444' },
  { name: 'Aluguel', value: 18.2, color: '#F59E0B' },
  { name: 'Marketing', value: 12.5, color: '#10B981' },
  { name: 'Operacional', value: 8.7, color: '#3B82F6' },
  { name: 'Outros', value: 2.3, color: '#6B7280' }
];

// Calculate KPI values from monthly data
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

export const getPrimaryKPIs = () => [
  {
    title: 'Receita Total',
    value: `R$ ${totalRevenue.toLocaleString()}`,
    change: ((totalRevenue - previousMonth.receita) / previousMonth.receita) * 100,
    target: 85,
    icon: 'DollarSign',
    alert: 'success' as const
  },
  {
    title: 'Despesa Total',
    value: `R$ ${totalExpenses.toLocaleString()}`,
    change: ((totalExpenses - previousMonth.despesa) / previousMonth.despesa) * 100,
    target: 75,
    icon: 'CreditCard',
    alert: 'warning' as const
  },
  {
    title: 'Geração de Caixa',
    value: `R$ ${cashGeneration.toLocaleString()}`,
    change: ((cashGeneration - previousCashGeneration) / previousCashGeneration) * 100,
    target: 65,
    icon: 'TrendingUp',
    alert: cashGeneration > previousCashGeneration ? 'success' as const : 'warning' as const
  },
  {
    title: 'Margem Líquida',
    value: `${netMargin.toFixed(1)}%`,
    change: netMargin - previousNetMargin,
    target: 40,
    icon: 'Percent',
    alert: netMargin > previousNetMargin ? 'success' as const : 'danger' as const
  }
];

export const getSecondaryKPIs = () => [
  {
    title: 'Ticket Médio',
    value: `R$ ${Math.round(averageTicket)}`,
    change: ((averageTicket - previousAverageTicket) / previousAverageTicket) * 100,
    target: 75,
    icon: 'Receipt',
    alert: averageTicket > previousAverageTicket ? 'success' as const : 'warning' as const
  },
  {
    title: 'Despesa Pessoal',
    value: '58.3%',
    change: 2.4,
    target: 95,
    icon: 'Users',
    alert: 'warning' as const
  },
  {
    title: 'Alunos Ativos',
    value: '1.247',
    change: 12.1,
    target: 90,
    icon: 'Users',
    alert: 'success' as const
  },
  {
    title: 'Metas Batidas',
    value: '7/12',
    change: 0,
    target: 58,
    icon: 'Target',
    alert: 'warning' as const
  }
];
