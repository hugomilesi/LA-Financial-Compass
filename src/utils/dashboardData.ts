
import { getDataByUnit, getHistoricalDataByUnit } from './unitData';

// Static cost center data (proportional to each unit)
export const costCenterData = [
  { name: 'Pessoal', value: 58.3, color: '#EF4444' },
  { name: 'Aluguel', value: 18.2, color: '#F59E0B' },
  { name: 'Marketing', value: 12.5, color: '#10B981' },
  { name: 'Operacional', value: 8.7, color: '#3B82F6' },
  { name: 'Outros', value: 2.3, color: '#6B7280' }
];

// Dynamic monthly data based on selected unit
export const getMonthlyData = (unitId: string) => {
  return getHistoricalDataByUnit(unitId);
};

// Dynamic KPI calculations based on selected unit
export const getPrimaryKPIs = (unitId: string) => {
  const data = getDataByUnit(unitId);
  const historicalData = getHistoricalDataByUnit(unitId);
  
  const currentMonth = historicalData[historicalData.length - 1];
  const previousMonth = historicalData[historicalData.length - 2];
  
  const totalRevenue = currentMonth.receita;
  const totalExpenses = currentMonth.despesa;
  const cashGeneration = totalRevenue - totalExpenses;
  const netMargin = ((cashGeneration / totalRevenue) * 100);
  
  const previousCashGeneration = previousMonth.receita - previousMonth.despesa;
  const previousNetMargin = ((previousCashGeneration / previousMonth.receita) * 100);

  return [
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
};

export const getSecondaryKPIs = (unitId: string) => {
  const data = getDataByUnit(unitId);
  const historicalData = getHistoricalDataByUnit(unitId);
  
  const currentMonth = historicalData[historicalData.length - 1];
  const previousMonth = historicalData[historicalData.length - 2];
  
  const currentActiveStudents = data.alunos;
  const previousActiveStudents = Math.round(currentActiveStudents * 0.89); // Simulated previous month
  const averageTicket = currentMonth.receita / currentActiveStudents;
  const previousAverageTicket = previousMonth.receita / previousActiveStudents;

  return [
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
      value: currentActiveStudents.toLocaleString(),
      change: ((currentActiveStudents - previousActiveStudents) / previousActiveStudents) * 100,
      target: 90,
      icon: 'Users',
      alert: 'success' as const
    },
    {
      title: 'Metas Batidas',
      value: unitId === 'all' ? '7/12' : '3/4',
      change: 0,
      target: 58,
      icon: 'Target',
      alert: 'warning' as const
    }
  ];
};

// Legacy exports for backward compatibility
export const monthlyData = getMonthlyData('all');
