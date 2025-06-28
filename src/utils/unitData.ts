
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

export const UNIT_DATA: Record<string, UnitFinancialData> = {
  'campo-grande': {
    receita: 145320,
    despesa: 113200,
    alunos: 734,
    matriculas: 67,
    ticketMedio: 198,
    capacidade: 950,
    ocupacao: 77 // 734/950 = 77.3%
  },
  'recreio': {
    receita: 128544,
    despesa: 101000,
    alunos: 650,
    matriculas: 56,
    ticketMedio: 198,
    capacidade: 880,
    ocupacao: 74 // 650/880 = 73.9%
  },
  'barra': {
    receita: 117591,
    despesa: 87700,
    alunos: 603,
    matriculas: 50,
    ticketMedio: 195,
    capacidade: 990,
    ocupacao: 61 // 603/990 = 60.9%
  }
};

// Historical data by unit - updated to match current values with proportional growth
export const UNIT_HISTORICAL_DATA: Record<string, Array<{month: string, receita: number, despesa: number}>> = {
  'campo-grande': [
    { month: 'Jan', receita: 129800, despesa: 106200 },
    { month: 'Fev', receita: 135600, despesa: 109100 },
    { month: 'Mar', receita: 140100, despesa: 111500 },
    { month: 'Abr', receita: 138700, despesa: 110700 },
    { month: 'Mai', receita: 141500, despesa: 112000 },
    { month: 'Jun', receita: 145320, despesa: 113200 }
  ],
  'recreio': [
    { month: 'Jan', receita: 114900, despesa: 94400 },
    { month: 'Fev', receita: 120900, despesa: 97300 },
    { month: 'Mar', receita: 125400, despesa: 99000 },
    { month: 'Abr', receita: 122400, despesa: 98100 },
    { month: 'Mai', receita: 125400, despesa: 99600 },
    { month: 'Jun', receita: 128544, despesa: 101000 }
  ],
  'barra': [
    { month: 'Jan', receita: 104600, despesa: 79200 },
    { month: 'Fev', receita: 109900, despesa: 81100 },
    { month: 'Mar', receita: 113600, despesa: 82900 },
    { month: 'Abr', receita: 111800, despesa: 83800 },
    { month: 'Mai', receita: 115400, despesa: 85600 },
    { month: 'Jun', receita: 117591, despesa: 87700 }
  ]
};

// Function to get consolidated data for all units
export const getConsolidatedData = (): UnitFinancialData => {
  const units = Object.values(UNIT_DATA);
  const totalReceita = units.reduce((sum, unit) => sum + unit.receita, 0);
  const totalAlunos = units.reduce((sum, unit) => sum + unit.alunos, 0);
  
  return {
    receita: totalReceita,
    despesa: units.reduce((sum, unit) => sum + unit.despesa, 0),
    alunos: totalAlunos,
    matriculas: units.reduce((sum, unit) => sum + unit.matriculas, 0),
    ticketMedio: Math.round(totalReceita / totalAlunos),
    capacidade: units.reduce((sum, unit) => sum + unit.capacidade, 0),
    ocupacao: Math.round((totalAlunos / units.reduce((sum, unit) => sum + unit.capacidade, 0)) * 100)
  };
};

// Function to get consolidated historical data
export const getConsolidatedHistoricalData = () => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  return months.map(month => {
    const monthData = Object.values(UNIT_HISTORICAL_DATA).map(unitHistory => 
      unitHistory.find(data => data.month === month)
    ).filter(Boolean);
    
    return {
      month,
      receita: monthData.reduce((sum, data) => sum + (data?.receita || 0), 0),
      despesa: monthData.reduce((sum, data) => sum + (data?.despesa || 0), 0)
    };
  });
};

// Function to get data by unit (or consolidated if 'all')
export const getDataByUnit = (unitId: string): UnitFinancialData => {
  if (unitId === 'all') {
    return getConsolidatedData();
  }
  return UNIT_DATA[unitId] || getConsolidatedData();
};

// Function to get historical data by unit (or consolidated if 'all')
export const getHistoricalDataByUnit = (unitId: string) => {
  if (unitId === 'all') {
    return getConsolidatedHistoricalData();
  }
  return UNIT_HISTORICAL_DATA[unitId] || getConsolidatedHistoricalData();
};
