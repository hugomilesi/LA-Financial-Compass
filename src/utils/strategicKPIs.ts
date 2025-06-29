
import { getDataByUnit, getHistoricalDataByUnit, getCostCenterDataByUnit } from './unitData';
import { PeriodFilter } from '@/contexts/PeriodContext';

// Strategic KPI calculations for the new dashboard focus
export const getStrategicKPIs = (unitId: string, period?: PeriodFilter) => {
  console.log('🎯 [strategicKPIs] Calculating strategic KPIs for unit:', unitId, 'Period:', period);
  
  const unitData = getDataByUnit(unitId);
  const historicalData = getHistoricalDataByUnit(unitId);
  const costCenterData = getCostCenterDataByUnit(unitId);
  
  let currentMonth, previousMonth;
  
  if (period && period.viewType === 'monthly' && !period.dateRange) {
    const getMonthlyDataPoint = (year: number, month: number) => {
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Aug', 'Set', 'Out', 'Nov', 'Dez'];
      const targetMonth = monthNames[month - 1];
      return historicalData.find(item => item.month === targetMonth) || historicalData[historicalData.length - 1];
    };
    
    currentMonth = getMonthlyDataPoint(period.year, period.month);
    const prevMonth = period.month === 1 ? 12 : period.month - 1;
    const prevYear = period.month === 1 ? period.year - 1 : period.year;
    previousMonth = getMonthlyDataPoint(prevYear, prevMonth);
  } else {
    currentMonth = historicalData[historicalData.length - 1];
    previousMonth = historicalData[historicalData.length - 2];
  }
  
  // 1. Churn Financeiro (% da receita perdida por cancelamentos)
  const churnFinanceiro = calculateChurnFinanceiro(unitId, currentMonth, previousMonth);
  
  // 2. Margem Líquida por Unidade
  const margemLiquidaUnidade = calculateMargemLiquidaUnidade(currentMonth);
  
  // 3. Permanência Média (em meses)
  const permanenciaMedia = calculatePermanenciaMedia(unitId);
  
  // 4. Receita por Colaborador
  const receitaPorColaborador = calculateReceitaPorColaborador(unitId, currentMonth);
  
  // 5. Ticket Médio vs CAC
  const ticketVsCAC = calculateTicketVsCAC(unitId);
  
  // 6. Custo por Aluno (melhorado)
  const custoAluno = calculateCustoAlunoMelhorado(currentMonth, unitData, previousMonth);
  
  return [
    churnFinanceiro,
    margemLiquidaUnidade,
    permanenciaMedia,
    receitaPorColaborador,
    ticketVsCAC,
    custoAluno
  ];
};

const calculateChurnFinanceiro = (unitId: string, currentMonth: any, previousMonth: any) => {
  // Simulação de churn baseada na variação de receita vs alunos
  const churnRates = {
    'campo-grande': 3.2,
    'recreio': 2.8,
    'barra': 3.5,
    'all': 3.1
  };
  
  const currentChurn = churnRates[unitId as keyof typeof churnRates] || churnRates.all;
  const previousChurn = currentChurn + 0.4; // Mês anterior teve churn maior
  const change = ((currentChurn - previousChurn) / previousChurn) * 100;
  
  return {
    title: 'Churn Financeiro',
    value: `${currentChurn.toFixed(1)}%`,
    change: change,
    target: 2.5,
    icon: 'TrendingDown',
    alert: currentChurn <= 2.5 ? 'success' as const : 
           currentChurn <= 4.0 ? 'warning' as const : 'danger' as const,
    subtitle: currentChurn <= 2.5 ? 'Excelente controle' :
              currentChurn <= 4.0 ? 'Dentro do aceitável' : 'Atenção necessária'
  };
};

const calculateMargemLiquidaUnidade = (currentMonth: any) => {
  const receita = currentMonth.receita;
  const despesa = currentMonth.despesa;
  const margemLiquida = ((receita - despesa) / receita) * 100;
  
  return {
    title: 'Margem Líquida',
    value: `${margemLiquida.toFixed(1)}%`,
    change: 2.3, // Simulação de melhora
    target: 25.0,
    icon: 'Percent',
    alert: margemLiquida >= 25 ? 'success' as const : 
           margemLiquida >= 20 ? 'warning' as const : 'danger' as const,
    subtitle: margemLiquida >= 25 ? 'Meta atingida' :
              margemLiquida >= 20 ? 'Próximo da meta' : 'Abaixo da meta'
  };
};

const calculatePermanenciaMedia = (unitId: string) => {
  // Simulação baseada no tipo de unidade
  const permanenciaBase = {
    'campo-grande': 18.5,
    'recreio': 20.2,
    'barra': 19.8,
    'all': 19.2
  };
  
  const permanencia = permanenciaBase[unitId as keyof typeof permanenciaBase] || permanenciaBase.all;
  
  return {
    title: 'Permanência Média',
    value: `${permanencia.toFixed(1)} meses`,
    change: 1.8, // Melhora na permanência
    target: 24,
    icon: 'Clock',
    alert: permanencia >= 24 ? 'success' as const : 
           permanencia >= 18 ? 'warning' as const : 'danger' as const,
    subtitle: permanencia >= 24 ? 'Excelente retenção' :
              permanencia >= 18 ? 'Boa retenção' : 'Melhorar retenção'
  };
};

const calculateReceitaPorColaborador = (unitId: string, currentMonth: any) => {
  // Estimativa de colaboradores por unidade
  const colaboradores = {
    'campo-grande': 28,
    'recreio': 22,
    'barra': 18,
    'all': 68
  };
  
  const numColaboradores = colaboradores[unitId as keyof typeof colaboradores] || colaboradores.all;
  const receitaPorColaborador = Math.round(currentMonth.receita / numColaboradores);
  
  return {
    title: 'Receita/Colaborador',
    value: `R$ ${receitaPorColaborador.toLocaleString()}`,
    change: 4.2, // Melhora na produtividade
    target: 6000,
    icon: 'Users',
    alert: receitaPorColaborador >= 6000 ? 'success' as const : 
           receitaPorColaborador >= 4500 ? 'warning' as const : 'danger' as const,
    subtitle: receitaPorColaborador >= 6000 ? 'Alta produtividade' :
              receitaPorColaborador >= 4500 ? 'Produtividade adequada' : 'Baixa produtividade'
  };
};

const calculateTicketVsCAC = (unitId: string) => {
  // CAC simulado por unidade
  const cacData = {
    'campo-grande': 125,
    'recreio': 142,
    'barra': 138,
    'all': 135
  };
  
  const ticketData = {
    'campo-grande': 362,
    'recreio': 415,
    'barra': 420,
    'all': 399
  };
  
  const cac = cacData[unitId as keyof typeof cacData] || cacData.all;
  const ticket = ticketData[unitId as keyof typeof ticketData] || ticketData.all;
  const ratio = ticket / cac;
  
  return {
    title: 'Ticket/CAC Ratio',
    value: `${ratio.toFixed(1)}x`,
    change: -2.1, // Leve queda na eficiência
    target: 3.5,
    icon: 'Target',
    alert: ratio >= 3.5 ? 'success' as const : 
           ratio >= 2.5 ? 'warning' as const : 'danger' as const,
    subtitle: ratio >= 3.5 ? 'Excelente eficiência' :
              ratio >= 2.5 ? 'Eficiência adequada' : 'Baixa eficiência'
  };
};

const calculateCustoAlunoMelhorado = (currentMonth: any, unitData: any, previousMonth: any) => {
  const custoAluno = Math.round(currentMonth.despesa / unitData.alunos);
  const custoPrevious = Math.round(previousMonth.despesa / (unitData.alunos * 0.95));
  const change = ((custoAluno - custoPrevious) / custoPrevious) * 100;
  
  return {
    title: 'Custo por Aluno',
    value: `R$ ${custoAluno}`,
    change: change,
    target: 250,
    icon: 'DollarSign',
    alert: custoAluno <= 250 ? 'success' as const : 
           custoAluno <= 300 ? 'warning' as const : 'danger' as const,
    subtitle: custoAluno <= 250 ? 'Custo otimizado' :
              custoAluno <= 300 ? 'Custo aceitável' : 'Custo elevado'
  };
};

// Strategic comparisons between units
export const getUnitComparison = () => {
  const units = ['campo-grande', 'recreio', 'barra'];
  
  return units.map(unitId => {
    const unitData = getDataByUnit(unitId);
    const historicalData = getHistoricalDataByUnit(unitId);
    const currentMonth = historicalData[historicalData.length - 1];
    
    const margemLiquida = ((currentMonth.receita - currentMonth.despesa) / currentMonth.receita) * 100;
    const custoAluno = Math.round(currentMonth.despesa / unitData.alunos);
    const ocupacao = unitData.ocupacao;
    
    return {
      unidade: unitId === 'campo-grande' ? 'Campo Grande' : 
               unitId === 'recreio' ? 'Recreio' : 'Barra',
      receita: currentMonth.receita,
      margemLiquida: margemLiquida,
      custoAluno: custoAluno,
      ocupacao: ocupacao,
      alunos: unitData.alunos,
      ticketMedio: unitData.ticketMedio
    };
  });
};
