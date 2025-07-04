import { getDataByUnit } from './unitData';
import { getHistoricalDataByUnit } from './kpiData';
import { getCostCenterDataByUnit } from './costCenterData';
import { PeriodFilter } from '@/contexts/PeriodContext';

// Dynamic cost center data based on selected unit and period
export const getCostCenterData = (unitId: string, period?: PeriodFilter) => {
  console.log('📊 [dashboardData.getCostCenterData] Requested unit:', unitId, 'Period:', period);
  const result = getCostCenterDataByUnit(unitId);
  console.log('📈 [dashboardData.getCostCenterData] Result:', result);
  return result;
};

// Dynamic cost center detail data based on selected unit and period
export const getCostCenterDetailData = (unitId: string, period?: PeriodFilter) => {
  console.log('📊 [dashboardData.getCostCenterDetailData] Requested unit:', unitId, 'Period:', period);
  const costCenterData = getCostCenterDataByUnit(unitId);
  
  const result = costCenterData.map(item => ({
    categoria: item.name,
    valor: item.amount,
    percentual: item.value
  }));
  
  console.log('📈 [dashboardData.getCostCenterDetailData] Result:', result);
  return result;
};

// Static cost center data (for backward compatibility)
export const costCenterData = [
  { name: 'Pessoal', value: 58.3, color: '#EF4444' },
  { name: 'Aluguel', value: 18.2, color: '#F59E0B' },
  { name: 'Marketing', value: 12.5, color: '#10B981' },
  { name: 'Operacional', value: 8.7, color: '#3B82F6' },
  { name: 'Outros', value: 2.3, color: '#6B7280' }
];

// Dynamic monthly data based on selected unit and period
export const getMonthlyData = (unitId: string, period?: PeriodFilter) => {
  console.log('📊 [dashboardData.getMonthlyData] Requested unit:', unitId, 'Period:', period);
  
  let result = getHistoricalDataByUnit(unitId);
  
  // Filter data based on period if provided
  if (period) {
    if (period.viewType === 'monthly' && !period.dateRange) {
      // For monthly view without custom date range, show all months but highlight current
      console.log('📅 Monthly view - showing all data with focus on:', period.month, period.year);
    } else if (period.dateRange) {
      // Handle custom date range - for now, keep all data
      // In a real implementation, you would filter based on the date range
      console.log('📅 Custom date range filtering not fully implemented yet');
    } else if (period.viewType === 'ytd') {
      // For YTD, show data up to current month
      console.log('📅 YTD view - showing year-to-date data for:', period.year);
    }
  }
  
  console.log('📈 [dashboardData.getMonthlyData] Result:', result);
  return result;
};

// Helper function to get data for specific month
const getMonthlyDataPoint = (unitId: string, year: number, month: number) => {
  const historicalData = getHistoricalDataByUnit(unitId);
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Aug', 'Set', 'Out', 'Nov', 'Dez'];
  const targetMonth = monthNames[month - 1];
  
  return historicalData.find(item => item.month === targetMonth) || historicalData[historicalData.length - 1];
};

// Dynamic KPI calculations based on selected unit and period
export const getPrimaryKPIs = (unitId: string, period?: PeriodFilter, customGoals?: Record<string, number>) => {
  console.log('🎯 [dashboardData.getPrimaryKPIs] Starting calculation for unit:', unitId, 'Period:', period);
  
  const historicalData = getHistoricalDataByUnit(unitId);
  console.log('📈 [dashboardData.getPrimaryKPIs] Historical data:', historicalData);
  
  let currentMonth, previousMonth;
  
  if (period && period.viewType === 'monthly' && !period.dateRange) {
    // Get data for specific month/year
    currentMonth = getMonthlyDataPoint(unitId, period.year, period.month);
    // Get previous month data
    const prevMonth = period.month === 1 ? 12 : period.month - 1;
    const prevYear = period.month === 1 ? period.year - 1 : period.year;
    previousMonth = getMonthlyDataPoint(unitId, prevYear, prevMonth);
    
    console.log('📅 [getPrimaryKPIs] Specific month data - Current:', currentMonth, 'Previous:', previousMonth);
  } else if (period && period.viewType === 'ytd') {
    // For YTD, calculate accumulated values up to current date
    const currentDate = new Date();
    const currentMonthIndex = Math.min(currentDate.getMonth(), historicalData.length - 1);
    
    const ytdData = historicalData.slice(0, currentMonthIndex + 1);
    const totalReceita = ytdData.reduce((sum, item) => sum + item.receita, 0);
    const totalDespesa = ytdData.reduce((sum, item) => sum + item.despesa, 0);
    
    currentMonth = { receita: totalReceita, despesa: totalDespesa };
    
    // Previous YTD (same period previous year or previous period)
    const prevYtdData = historicalData.slice(0, Math.max(1, currentMonthIndex));
    const prevTotalReceita = prevYtdData.reduce((sum, item) => sum + item.receita, 0);
    const prevTotalDespesa = prevYtdData.reduce((sum, item) => sum + item.despesa, 0);
    
    previousMonth = { receita: prevTotalReceita, despesa: prevTotalDespesa };
    
    console.log('📅 [getPrimaryKPIs] YTD data - Current:', currentMonth, 'Previous:', previousMonth);
  } else {
    // Default behavior - use latest month
    currentMonth = historicalData[historicalData.length - 1];
    previousMonth = historicalData[historicalData.length - 2];
    console.log('📅 [getPrimaryKPIs] Default data - Current:', currentMonth, 'Previous:', previousMonth);
  }
  
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

  // Traffic light system based on goals
  const getTrafficLightStatus = (current: number, target: number, isReversed = false) => {
    if (isReversed) {
      // For expenses - lower is better
      if (current <= target * 0.9) return 'success' as const;  // 10%+ under budget
      if (current <= target) return 'warning' as const;        // On budget or slightly under
      return 'danger' as const;  // Over budget
    } else {
      // For revenue, margin - higher is better
      const percentage = (current / target) * 100;
      if (percentage >= 95) return 'success' as const;  // 95%+ of goal
      if (percentage >= 80) return 'warning' as const;  // 80-94% of goal
      return 'danger' as const;  // Less than 80% of goal
    }
  };

  // Define goals for each KPI (use custom goals if provided, otherwise defaults)
  const revenueGoal = customGoals?.['Receita Total'] || 800000; // R$ 800K monthly goal
  const expenseGoal = customGoals?.['Despesa Total'] || 600000; // R$ 600K expense limit
  const cashGoal = customGoals?.['Geração de Caixa'] || 200000; // R$ 200K cash generation goal
  const marginGoal = customGoals?.['Margem Líquida'] || 25; // 25% margin goal

  const result = [
    {
      title: 'Receita Total',
      value: `R$ ${totalRevenue.toLocaleString()}`,
      change: revenueChange,
      target: Math.min(100, Math.round((totalRevenue / revenueGoal) * 100)),
      goalValue: revenueGoal,
      icon: 'DollarSign',
      alert: getTrafficLightStatus(totalRevenue, revenueGoal),
      subtitle: `Meta: R$ ${revenueGoal.toLocaleString()}`
    },
    {
      title: 'Despesa Total',
      value: `R$ ${totalExpenses.toLocaleString()}`,
      change: expenseChange,
      target: Math.min(100, Math.round((totalExpenses / expenseGoal) * 100)),
      goalValue: expenseGoal,
      icon: 'CreditCard',
      alert: getTrafficLightStatus(totalExpenses, expenseGoal, true),
      subtitle: `Limite: R$ ${expenseGoal.toLocaleString()}`
    },
    {
      title: 'Geração de Caixa',
      value: `R$ ${cashGeneration.toLocaleString()}`,
      change: cashChange,
      target: Math.min(100, Math.round((cashGeneration / cashGoal) * 100)),
      goalValue: cashGoal,
      icon: 'TrendingUp',
      alert: getTrafficLightStatus(cashGeneration, cashGoal),
      subtitle: `Meta: R$ ${cashGoal.toLocaleString()}`
    },
    {
      title: 'Margem Líquida',
      value: `${netMargin.toFixed(1)}%`,
      change: marginChange,
      target: Math.min(100, Math.round((netMargin / marginGoal) * 100)),
      goalValue: marginGoal,
      icon: 'Percent',
      alert: getTrafficLightStatus(netMargin, marginGoal),
      subtitle: `Meta: ${marginGoal}%`
    }
  ];

  console.log('✅ [dashboardData.getPrimaryKPIs] Final result:', result);
  return result;
};

export const getSecondaryKPIs = (unitId: string, period?: PeriodFilter, customGoals?: Record<string, number>) => {
  console.log('🎯 [dashboardData.getSecondaryKPIs] Starting calculation for unit:', unitId, 'Period:', period);
  
  const data = getDataByUnit(unitId);
  console.log('📊 [dashboardData.getSecondaryKPIs] Unit data:', data);
  
  const historicalData = getHistoricalDataByUnit(unitId);
  
  let currentMonth, previousMonth;
  
  if (period && period.viewType === 'monthly' && !period.dateRange) {
    currentMonth = getMonthlyDataPoint(unitId, period.year, period.month);
    const prevMonth = period.month === 1 ? 12 : period.month - 1;
    const prevYear = period.month === 1 ? period.year - 1 : period.year;
    previousMonth = getMonthlyDataPoint(unitId, prevYear, prevMonth);
  } else {
    currentMonth = historicalData[historicalData.length - 1];
    previousMonth = historicalData[historicalData.length - 2];
  }
  
  const currentActiveStudents = data.alunos;
  const previousActiveStudents = Math.round(currentActiveStudents * 0.95); // More realistic previous month
  const averageTicket = data.ticketMedio;
  const previousAverageTicket = Math.round(averageTicket * 0.98); // Slight growth

  // Calculate cost per student based on actual period data
  const costPerStudent = Math.round(currentMonth.despesa / currentActiveStudents);
  const previousCostPerStudent = Math.round(previousMonth.despesa / previousActiveStudents);

  // Calculate delinquency rate (inadimplência)
  const getDelinquencyRate = (unitId: string) => {
    // Realistic delinquency rates by unit
    const baseRates = {
      'campo-grande': 4.2,
      'recreio': 3.8,
      'barra': 5.1
    };
    
    if (unitId === 'all') {
      // Weighted average for consolidated view
      const totalStudents = 465 + 315 + 220;
      return (
        (baseRates['campo-grande'] * 465 + 
         baseRates['recreio'] * 315 + 
         baseRates['barra'] * 220) / totalStudents
      );
    }
    
    return baseRates[unitId as keyof typeof baseRates] || 4.0;
  };

  const currentDelinquency = getDelinquencyRate(unitId);
  const previousDelinquency = currentDelinquency + 0.3; // Previous month was slightly higher
  const delinquencyChange = currentDelinquency - previousDelinquency;

  console.log('🎫 [dashboardData.getSecondaryKPIs] Average Ticket:', averageTicket);
  console.log('💰 [dashboardData.getSecondaryKPIs] Cost per Student:', costPerStudent);
  console.log('👥 [dashboardData.getSecondaryKPIs] Active Students:', currentActiveStudents);
  console.log('⚠️ [dashboardData.getSecondaryKPIs] Delinquency Rate:', currentDelinquency);

  // Traffic light system for secondary KPIs
  const getSecondaryTrafficLightStatus = (current: number, target: number, isReversed = false) => {
    if (isReversed) {
      // For cost per student, delinquency - lower is better
      if (current <= target * 0.9) return 'success' as const;  // 10%+ under target
      if (current <= target) return 'warning' as const;        // At target or slightly under
      return 'danger' as const;  // Over target
    } else {
      // For ticket, students - higher is better
      const percentage = (current / target) * 100;
      if (percentage >= 95) return 'success' as const;  // 95%+ of goal
      if (percentage >= 80) return 'warning' as const;  // 80-94% of goal
      return 'danger' as const;  // Less than 80% of goal
    }
  };

  // Define goals for secondary KPIs (use custom goals if provided, otherwise defaults)
  const ticketGoal = customGoals?.['Ticket Médio'] || 850; // R$ 850 ticket goal
  const costPerStudentGoal = customGoals?.['Custo por Aluno'] || 380; // R$ 380 max cost per student
  const studentsGoal = customGoals?.['Alunos Ativos'] || 500; // 500 students goal
  const delinquencyGoal = customGoals?.['Inadimplência (%)'] || 3.0; // 3% max delinquency

  const result = [
    {
      title: 'Ticket Médio',
      value: `R$ ${averageTicket}`,
      change: ((averageTicket - previousAverageTicket) / previousAverageTicket) * 100,
      target: Math.min(100, Math.round((averageTicket / ticketGoal) * 100)),
      goalValue: ticketGoal,
      icon: 'Receipt',
      alert: getSecondaryTrafficLightStatus(averageTicket, ticketGoal),
      subtitle: `Meta: R$ ${ticketGoal}`
    },
    {
      title: 'Custo por Aluno',
      value: `R$ ${costPerStudent}`,
      change: ((costPerStudent - previousCostPerStudent) / previousCostPerStudent) * 100,
      target: Math.min(100, Math.round((costPerStudent / costPerStudentGoal) * 100)),
      goalValue: costPerStudentGoal,
      icon: 'DollarSign',
      alert: getSecondaryTrafficLightStatus(costPerStudent, costPerStudentGoal, true),
      subtitle: `Máximo: R$ ${costPerStudentGoal}`
    },
    {
      title: 'Alunos Ativos',
      value: currentActiveStudents.toLocaleString(),
      change: ((currentActiveStudents - previousActiveStudents) / previousActiveStudents) * 100,
      target: Math.min(100, Math.round((currentActiveStudents / studentsGoal) * 100)),
      goalValue: studentsGoal,
      icon: 'Users',
      alert: getSecondaryTrafficLightStatus(currentActiveStudents, studentsGoal),
      subtitle: `Meta: ${studentsGoal} alunos`
    },
    {
      title: 'Inadimplência (%)',
      value: `${currentDelinquency.toFixed(1)}%`,
      change: delinquencyChange,
      target: Math.min(100, Math.round((currentDelinquency / delinquencyGoal) * 100)),
      goalValue: delinquencyGoal,
      icon: 'TrendingDown',
      alert: currentDelinquency <= delinquencyGoal ? 'success' as const : 
             currentDelinquency <= delinquencyGoal * 1.5 ? 'warning' as const : 'danger' as const,
      subtitle: `Máximo: ${delinquencyGoal}%`
    }
  ];

  console.log('✅ [dashboardData.getSecondaryKPIs] Final result:', result);
  return result;
};

// Dynamic DRE data calculation
export const getDREData = (unitId: string, period?: PeriodFilter) => {
  console.log('📊 [dashboardData.getDREData] Calculating DRE for unit:', unitId, 'Period:', period);
  
  const historicalData = getHistoricalDataByUnit(unitId);
  const costCenterData = getCostCenterDataByUnit(unitId);
  
  let currentPeriodData;
  let periodLabel = 'Junho 2024';
  
  if (period && period.viewType === 'monthly' && !period.dateRange) {
    // Get data for specific month/year
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Aug', 'Set', 'Out', 'Nov', 'Dez'];
    const monthNamesFull = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const targetMonth = monthNames[period.month - 1];
    
    currentPeriodData = historicalData.find(item => item.month === targetMonth) || historicalData[historicalData.length - 1];
    periodLabel = `${monthNamesFull[period.month - 1]} ${period.year}`;
  } else if (period && period.viewType === 'ytd') {
    // Calculate YTD accumulated values
    const currentDate = new Date();
    const currentMonthIndex = Math.min(currentDate.getMonth(), historicalData.length - 1);
    
    const ytdData = historicalData.slice(0, currentMonthIndex + 1);
    const totalReceita = ytdData.reduce((sum, item) => sum + item.receita, 0);
    const totalDespesa = ytdData.reduce((sum, item) => sum + item.despesa, 0);
    
    currentPeriodData = { receita: totalReceita, despesa: totalDespesa };
    periodLabel = `Acumulado ${period.year}`;
  } else {
    // Default to latest month
    currentPeriodData = historicalData[historicalData.length - 1];
  }
  
  const totalReceita = currentPeriodData.receita;
  const totalDespesa = currentPeriodData.despesa;
  const lucroLiquido = totalReceita - totalDespesa;
  
  // Calculate revenue breakdown (percentages based on typical education business)
  const mensalidades = Math.round(totalReceita * 0.796);
  const matriculas = Math.round(totalReceita * 0.132);
  const outrasReceitas = totalReceita - mensalidades - matriculas;
  
  // Calculate expense breakdown based on cost center data
  const despesasPorCategoria = costCenterData.reduce((acc, item) => {
    const valor = Math.round((item.value / 100) * totalDespesa);
    acc[item.name] = valor;
    return acc;
  }, {} as Record<string, number>);
  
  // Ensure we have all major categories
  const pessoal = despesasPorCategoria['Pessoal'] || Math.round(totalDespesa * 0.583);
  const aluguel = despesasPorCategoria['Aluguel'] || Math.round(totalDespesa * 0.182);
  const marketing = despesasPorCategoria['Marketing'] || Math.round(totalDespesa * 0.125);
  const operacional = despesasPorCategoria['Operacional'] || Math.round(totalDespesa * 0.087);
  const outros = totalDespesa - pessoal - aluguel - marketing - operacional;
  
  console.log('📈 [dashboardData.getDREData] Calculated DRE:', {
    totalReceita,
    totalDespesa,
    lucroLiquido,
    periodLabel
  });
  
  return {
    periodLabel,
    receitas: {
      total: totalReceita,
      mensalidades,
      matriculas,
      outras: outrasReceitas
    },
    despesas: {
      total: totalDespesa,
      pessoal,
      aluguel,
      marketing,
      operacional,
      outros
    },
    lucroLiquido
  };
};

// Helper function to get consolidated data for multiple units
export const getConsolidatedDREData = (unitIds: string[], period?: PeriodFilter) => {
  console.log('📊 [dashboardData.getConsolidatedDREData] Consolidating for units:', unitIds, 'Period:', period);
  
  if (unitIds.includes('all') || unitIds.length === 0) {
    return getDREData('all', period);
  }
  
  // Sum up data from multiple specific units
  const unitDataArray = unitIds.map(unitId => getDREData(unitId, period));
  
  const consolidated = unitDataArray.reduce((acc, unitData) => {
    acc.receitas.total += unitData.receitas.total;
    acc.receitas.mensalidades += unitData.receitas.mensalidades;
    acc.receitas.matriculas += unitData.receitas.matriculas;
    acc.receitas.outras += unitData.receitas.outras;
    
    acc.despesas.total += unitData.despesas.total;
    acc.despesas.pessoal += unitData.despesas.pessoal;
    acc.despesas.aluguel += unitData.despesas.aluguel;
    acc.despesas.marketing += unitData.despesas.marketing;
    acc.despesas.operacional += unitData.despesas.operacional;
    acc.despesas.outros += unitData.despesas.outros;
    
    return acc;
  }, {
    periodLabel: unitDataArray[0]?.periodLabel || 'Período',
    receitas: { total: 0, mensalidades: 0, matriculas: 0, outras: 0 },
    despesas: { total: 0, pessoal: 0, aluguel: 0, marketing: 0, operacional: 0, outros: 0 },
    lucroLiquido: 0
  });
  
  consolidated.lucroLiquido = consolidated.receitas.total - consolidated.despesas.total;
  
  return consolidated;
};


