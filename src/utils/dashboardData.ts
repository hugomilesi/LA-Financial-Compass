
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
  console.log('📊 [dashboardData.getMonthlyData] Requested unit:', unitId);
  const result = getHistoricalDataByUnit(unitId);
  console.log('📈 [dashboardData.getMonthlyData] Result:', result);
  return result;
};

// Dynamic KPI calculations based on selected unit
export const getPrimaryKPIs = (unitId: string) => {
  console.log('🎯 [dashboardData.getPrimaryKPIs] Starting calculation for unit:', unitId);
  
  const data = getDataByUnit(unitId);
  console.log('📊 [dashboardData.getPrimaryKPIs] Unit data:', data);
  
  const historicalData = getHistoricalDataByUnit(unitId);
  console.log('📈 [dashboardData.getPrimaryKPIs] Historical data:', historicalData);
  
  const currentMonth = historicalData[historicalData.length - 1];
  const previousMonth = historicalData[historicalData.length - 2];
  
  console.log('📅 [dashboardData.getPrimaryKPIs] Current month:', currentMonth);
  console.log('📅 [dashboardData.getPrimaryKPIs] Previous month:', previousMonth);
  
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

  console.log('💰 [dashboardData.getPrimaryKPIs] Total Revenue:', totalRevenue);
  console.log('💸 [dashboardData.getPrimaryKPIs] Total Expenses:', totalExpenses);
  console.log('💵 [dashboardData.getPrimaryKPIs] Cash Generation:', cashGeneration);
  console.log('📊 [dashboardData.getPrimaryKPIs] Net Margin:', netMargin);

  const result = [
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

  console.log('✅ [dashboardData.getPrimaryKPIs] Final result:', result);
  return result;
};

export const getSecondaryKPIs = (unitId: string) => {
  console.log('🎯 [dashboardData.getSecondaryKPIs] Starting calculation for unit:', unitId);
  
  const data = getDataByUnit(unitId);
  console.log('📊 [dashboardData.getSecondaryKPIs] Unit data:', data);
  
  const historicalData = getHistoricalDataByUnit(unitId);
  
  const currentMonth = historicalData[historicalData.length - 1];
  const previousMonth = historicalData[historicalData.length - 2];
  
  const currentActiveStudents = data.alunos;
  const previousActiveStudents = Math.round(currentActiveStudents * 0.95); // More realistic previous month
  const averageTicket = data.ticketMedio;
  const previousAverageTicket = Math.round(averageTicket * 0.98); // Slight growth

  // Calculate cost per student
  const costPerStudent = Math.round(data.despesa / data.alunos);
  const previousCostPerStudent = Math.round(previousMonth.despesa / (currentActiveStudents * 0.95));

  // Calculate staff cost percentage (mock calculation)
  const staffCostPercentage = 58.3;
  const previousStaffCost = 56.8;

  // Calculate goals met (mock calculation based on unit)
  const goalsMetValue = unitId === 'all' ? '7/12' : 
                       unitId === 'campo-grande' ? '3/4' :
                       unitId === 'recreio' ? '2/4' : '2/4';

  console.log('🎫 [dashboardData.getSecondaryKPIs] Average Ticket:', averageTicket);
  console.log('💰 [dashboardData.getSecondaryKPIs] Cost per Student:', costPerStudent);
  console.log('👥 [dashboardData.getSecondaryKPIs] Active Students:', currentActiveStudents);

  const result = [
    {
      title: 'Ticket Médio',
      value: `R$ ${averageTicket}`,
      change: ((averageTicket - previousAverageTicket) / previousAverageTicket) * 100,
      target: 75,
      icon: 'Receipt',
      alert: averageTicket > previousAverageTicket ? 'success' as const : 'warning' as const
    },
    {
      title: 'Custo por Aluno',
      value: `R$ ${costPerStudent}`,
      change: ((costPerStudent - previousCostPerStudent) / previousCostPerStudent) * 100,
      target: 70,
      icon: 'DollarSign',
      alert: costPerStudent < previousCostPerStudent ? 'success' as const : 'warning' as const
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

  console.log('✅ [dashboardData.getSecondaryKPIs] Final result:', result);
  return result;
};

// Legacy exports for backward compatibility
export const monthlyData = getMonthlyData('all');
