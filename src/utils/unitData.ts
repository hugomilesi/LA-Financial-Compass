// Unit-specific data structure
export interface UnitFinancialData {
  receita: number;
  despesa: number;
  alunos: number;
  matriculas: number;
  ticketMedio: number;
  capacidade: number;
  ocupacao: number;
}

// Unit-specific cost center data structure
export interface UnitCostCenterData {
  name: string;
  value: number;
  color: string;
  amount: number;
}

// Historical data structure
export interface UnitHistoricalData {
  month: string;
  receita: number;
  despesa: number;
  alunos: number;
}

export const UNIT_DATA: Record<string, UnitFinancialData> = {
  'campo-grande': {
    receita: 145320,
    despesa: 113930,
    alunos: 465,
    matriculas: 67,
    ticketMedio: 362,
    capacidade: 950,
    ocupacao: 49
  },
  'recreio': {
    receita: 128544,
    despesa: 101574,
    alunos: 315,
    matriculas: 56,
    ticketMedio: 415,
    capacidade: 880,
    ocupacao: 36
  },
  'barra': {
    receita: 117591,
    despesa: 69871,
    alunos: 220,
    matriculas: 50,
    ticketMedio: 420,
    capacidade: 990,
    ocupacao: 22
  }
};

// Unit-specific cost center data
export const UNIT_COST_CENTER_DATA: Record<string, UnitCostCenterData[]> = {
  'campo-grande': [
    { name: 'Pessoal', value: 60.1, color: '#EF4444', amount: 68451 },
    { name: 'Aluguel', value: 17.5, color: '#F59E0B', amount: 19938 },
    { name: 'Marketing', value: 12.8, color: '#10B981', amount: 14583 },
    { name: 'Operacional', value: 7.9, color: '#3B82F6', amount: 9001 },
    { name: 'Outros', value: 1.7, color: '#6B7280', amount: 1957 }
  ],
  'recreio': [
    { name: 'Pessoal', value: 57.2, color: '#EF4444', amount: 58100 },
    { name: 'Aluguel', value: 19.1, color: '#F59E0B', amount: 19401 },
    { name: 'Marketing', value: 13.5, color: '#10B981', amount: 13712 },
    { name: 'Operacional', value: 8.4, color: '#3B82F6', amount: 8532 },
    { name: 'Outros', value: 1.8, color: '#6B7280', amount: 1829 }
  ],
  'barra': [
    { name: 'Pessoal', value: 55.8, color: '#EF4444', amount: 38968 },
    { name: 'Aluguel', value: 18.7, color: '#F59E0B', amount: 13066 },
    { name: 'Marketing', value: 14.2, color: '#10B981', amount: 9922 },
    { name: 'Operacional', value: 9.1, color: '#3B82F6', amount: 6360 },
    { name: 'Outros', value: 2.2, color: '#6B7280', amount: 1555 }
  ]
};

// Historical data by unit - updated to include alunos data
export const UNIT_HISTORICAL_DATA: Record<string, UnitHistoricalData[]> = {
  'campo-grande': [
    { month: 'Jan', receita: 129800, despesa: 106964, alunos: 440 },
    { month: 'Fev', receita: 135600, despesa: 109716, alunos: 450 },
    { month: 'Mar', receita: 140100, despesa: 112242, alunos: 455 },
    { month: 'Abr', receita: 138700, despesa: 111304, alunos: 460 },
    { month: 'Mai', receita: 141500, despesa: 112681, alunos: 462 },
    { month: 'Jun', receita: 145320, despesa: 113930, alunos: 465 }
  ],
  'recreio': [
    { month: 'Jan', receita: 114900, despesa: 95366, alunos: 290 },
    { month: 'Fev', receita: 120900, despesa: 97925, alunos: 300 },
    { month: 'Mar', receita: 125400, despesa: 99807, alunos: 305 },
    { month: 'Abr', receita: 122400, despesa: 98867, alunos: 308 },
    { month: 'Mai', receita: 125400, despesa: 100286, alunos: 312 },
    { month: 'Jun', receita: 128544, despesa: 101574, alunos: 315 }
  ],
  'barra': [
    { month: 'Jan', receita: 104600, despesa: 65473, alunos: 200 },
    { month: 'Fev', receita: 109900, despesa: 67007, alunos: 205 },
    { month: 'Mar', receita: 113600, despesa: 68252, alunos: 210 },
    { month: 'Abr', receita: 111800, despesa: 67714, alunos: 215 },
    { month: 'Mai', receita: 115400, despesa: 68851, alunos: 218 },
    { month: 'Jun', receita: 117591, despesa: 69871, alunos: 220 }
  ]
};

// Function to get consolidated data for all units
export const getConsolidatedData = (): UnitFinancialData => {
  console.log('🔍 [getConsolidatedData] Starting calculation...');
  
  const units = Object.values(UNIT_DATA);
  console.log('📊 [getConsolidatedData] Unit data:', units);
  
  const totalReceita = units.reduce((sum, unit) => sum + unit.receita, 0);
  const totalAlunos = units.reduce((sum, unit) => sum + unit.alunos, 0);
  const totalDespesa = units.reduce((sum, unit) => sum + unit.despesa, 0);
  const totalMatriculas = units.reduce((sum, unit) => sum + unit.matriculas, 0);
  const totalCapacidade = units.reduce((sum, unit) => sum + unit.capacidade, 0);
  
  // Fixed consolidated ticket price as requested by user
  const ticketMedio = 399;
  const ocupacao = Math.round((totalAlunos / totalCapacidade) * 100);
  
  console.log('💰 [getConsolidatedData] Total Receita:', totalReceita);
  console.log('👥 [getConsolidatedData] Total Alunos:', totalAlunos);
  console.log('💸 [getConsolidatedData] Total Despesa:', totalDespesa);
  console.log('📝 [getConsolidatedData] Total Matriculas:', totalMatriculas);
  console.log('🎯 [getConsolidatedData] Ticket Médio:', ticketMedio);
  console.log('📈 [getConsolidatedData] Ocupação:', ocupacao);
  
  const result = {
    receita: totalReceita,
    despesa: totalDespesa,
    alunos: totalAlunos,
    matriculas: totalMatriculas,
    ticketMedio: ticketMedio,
    capacidade: totalCapacidade,
    ocupacao: ocupacao
  };
  
  console.log('✅ [getConsolidatedData] Final result:', result);
  return result;
};

// Function to get consolidated cost center data
export const getConsolidatedCostCenterData = (): UnitCostCenterData[] => {
  console.log('🔍 [getConsolidatedCostCenterData] Starting calculation...');
  
  const allUnits = Object.values(UNIT_COST_CENTER_DATA);
  const categories = ['Pessoal', 'Aluguel', 'Marketing', 'Operacional', 'Outros'];
  
  const result = categories.map(category => {
    const totalAmount = allUnits.reduce((sum, unitData) => {
      const categoryData = unitData.find(item => item.name === category);
      return sum + (categoryData?.amount || 0);
    }, 0);
    
    const totalExpenses = Object.values(UNIT_DATA).reduce((sum, unit) => sum + unit.despesa, 0);
    const percentage = (totalAmount / totalExpenses) * 100;
    
    const categoryItem = allUnits[0].find(item => item.name === category);
    
    return {
      name: category,
      value: Math.round(percentage * 10) / 10,
      color: categoryItem?.color || '#6B7280',
      amount: totalAmount
    };
  });
  
  console.log('✅ [getConsolidatedCostCenterData] Final result:', result);
  return result;
};

// Function to get consolidated historical data - updated to include alunos
export const getConsolidatedHistoricalData = (): UnitHistoricalData[] => {
  console.log('📈 [getConsolidatedHistoricalData] Starting calculation...');
  
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  const result = months.map(month => {
    const monthData = Object.values(UNIT_HISTORICAL_DATA).map(unitHistory => 
      unitHistory.find(data => data.month === month)
    ).filter(Boolean);
    
    const monthResult = {
      month,
      receita: monthData.reduce((sum, data) => sum + (data?.receita || 0), 0),
      despesa: monthData.reduce((sum, data) => sum + (data?.despesa || 0), 0),
      alunos: monthData.reduce((sum, data) => sum + (data?.alunos || 0), 0)
    };
    
    console.log(`📊 [getConsolidatedHistoricalData] ${month}:`, monthResult);
    return monthResult;
  });
  
  console.log('✅ [getConsolidatedHistoricalData] Final result:', result);
  return result;
};

// Function to get data by unit (or consolidated if 'all')
export const getDataByUnit = (unitId: string): UnitFinancialData => {
  console.log('🔍 [getDataByUnit] Requested unit:', unitId);
  
  if (unitId === 'all') {
    console.log('🌐 [getDataByUnit] Getting consolidated data...');
    return getConsolidatedData();
  }
  
  const unitData = UNIT_DATA[unitId];
  if (unitData) {
    console.log('🏢 [getDataByUnit] Unit data found:', unitData);
    return unitData;
  }
  
  console.log('⚠️ [getDataByUnit] Unit not found, returning consolidated data');
  return getConsolidatedData();
};

// Function to get cost center data by unit (or consolidated if 'all')
export const getCostCenterDataByUnit = (unitId: string): UnitCostCenterData[] => {
  console.log('🔍 [getCostCenterDataByUnit] Requested unit:', unitId);
  
  if (unitId === 'all') {
    console.log('🌐 [getCostCenterDataByUnit] Getting consolidated cost center data...');
    return getConsolidatedCostCenterData();
  }
  
  const unitCostData = UNIT_COST_CENTER_DATA[unitId];
  if (unitCostData) {
    console.log('🏢 [getCostCenterDataByUnit] Unit cost center data found:', unitCostData);
    return unitCostData;
  }
  
  console.log('⚠️ [getCostCenterDataByUnit] Unit cost center data not found, returning consolidated data');
  return getConsolidatedCostCenterData();
};

// Function to get historical data by unit (or consolidated if 'all') - updated return type
export const getHistoricalDataByUnit = (unitId: string): UnitHistoricalData[] => {
  console.log('📈 [getHistoricalDataByUnit] Requested unit:', unitId);
  
  if (unitId === 'all') {
    console.log('🌐 [getHistoricalDataByUnit] Getting consolidated historical data...');
    return getConsolidatedHistoricalData();
  }
  
  const unitHistoricalData = UNIT_HISTORICAL_DATA[unitId];
  if (unitHistoricalData) {
    console.log('🏢 [getHistoricalDataByUnit] Unit historical data found:', unitHistoricalData);
    return unitHistoricalData;
  }
  
  console.log('⚠️ [getHistoricalDataByUnit] Unit historical data not found, returning consolidated data');
  return getConsolidatedHistoricalData();
};
