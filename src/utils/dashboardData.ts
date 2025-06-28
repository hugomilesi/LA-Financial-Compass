
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

  // Calculate percentage changes
  const revenueChange = ((totalRevenue - previousMonth.receita) / previousMonth.receita) * 100;
  const expenseChange = ((totalExpenses - previousMonth.despesa) / previousMonth.despesa) * 100;
  const cashChange = ((cashGeneration - previousCashGeneration) / previousCashGeneration) * 100;
  const marginChange = netMargin - previousNetMargin;

  return [
    {
      title: 'Receita Total',
      value: `R$ ${totalRevenue.toLocaleString()}`,
      change: revenueChange,
      target: 85,
      icon: 'DollarSign',
      alert: revenueChange > 0 ? 'success' as const : 'warning' as const
    },
    {
      title: 'Despesa Total',
      value: `R$ ${totalExpenses.toLocaleString()}`,
      change: expenseChange,
      target: 75,
      icon: 'CreditCard',
      alert: expenseChange < 0 ? 'success' as const : 'danger' as const
    },
    {
      title: 'Geração de Caixa',
      value: `R$ ${cashGeneration.toLocaleString()}`,
      change: cashChange,
      target: 65,
      icon: 'TrendingUp',
      alert: cashChange > 0 ? 'success' as const : 'warning' as const
    },
    {
      title: 'Margem Líquida',
      value: `${netMargin.toFixed(1)}%`,
      change: marginChange,
      target: 40,
      icon: 'Percent',
      alert: marginChange > 0 ? 'success' as const : 'warning' as const
    }
  ];
};

export const getSecondaryKPIs = (unitId: string) => {
  const data = getDataByUnit(unitId);
  const historicalData = getHistoricalDataByUnit(unitId);
  
  const currentMonth = historicalData[historicalData.length - 1];
  const previousMonth = historicalData[historicalData.length - 2];
  
  const currentActiveStudents = data.alunos;
  const previousActiveStudents = Math.round(currentActiveStudents * 0.95); // More realistic previous month
  const averageTicket = data.ticketMedio;
  const previousAverageTicket = Math.round(averageTicket * 0.98); // Slight growth

  // Calculate occupancy rate
  const occupancyRate = data.ocupacao;
  const previousOccupancy = Math.round(occupancyRate * 0.96);

  // Calculate staff cost percentage (mock calculation)
  const staffCostPercentage = 58.3;
  const previousStaffCost = 56.8;

  // Calculate goals met (mock calculation based on unit)
  const goalsMetValue = unitId === 'all' ? '7/12' : 
                       unitId === 'campo-grande' ? '3/4' :
                       unitId === 'recreio' ? '2/4' : '2/4';

  return [
    {
      title: 'Ticket Médio',
      value: `R$ ${averageTicket}`,
      change: ((averageTicket - previousAverageTicket) / previousAverageTicket) * 100,
      target: 75,
      icon: 'Receipt',
      alert: averageTicket > previousAverageTicket ? 'success' as const : 'warning' as const
    },
    {
      title: 'Taxa de Ocupação',
      value: `${occupancyRate}%`,
      change: ((occupancyRate - previousOccupancy) / previousOccupancy) * 100,
      target: 80,
      icon: 'Percent',
      alert: occupancyRate > previousOccupancy ? 'success' as const : 'warning' as const
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
      value: goalsMetValue,
      change: 0,
      target: 58,
      icon: 'Target',
      alert: 'warning' as const
    }
  ];
};

// Legacy exports for backward compatibility
export const monthlyData = getMonthlyData('all');
