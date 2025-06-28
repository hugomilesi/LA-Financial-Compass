
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
    receita: 98500,
    despesa: 76800,
    alunos: 498,
    matriculas: 45,
    ticketMedio: 198,
    capacidade: 650,
    ocupacao: 77 // 498/650 = 76.6%
  },
  'recreio': {
    receita: 87200,
    despesa: 68500,
    alunos: 441,
    matriculas: 38,
    ticketMedio: 198,
    capacidade: 600,
    ocupacao: 74 // 441/600 = 73.5%
  },
  'barra': {
    receita: 65280,
    despesa: 48700,
    alunos: 335,
    matriculas: 28,
    ticketMedio: 195,
    capacidade: 550,
    ocupacao: 61 // 335/550 = 60.9%
  }
};

// Historical data by unit - updated to match current values
export const UNIT_HISTORICAL_DATA: Record<string, Array<{month: string, receita: number, despesa: number}>> = {
  'campo-grande': [
    { month: 'Jan', receita: 88000, despesa: 72000 },
    { month: 'Fev', receita: 92000, despesa: 74000 },
    { month: 'Mar', receita: 95000, despesa: 76000 },
    { month: 'Abr', receita: 94000, despesa: 75000 },
    { month: 'Mai', receita: 96000, despesa: 76000 },
    { month: 'Jun', receita: 98500, despesa: 76800 }
  ],
  'recreio': [
    { month: 'Jan', receita: 78000, despesa: 64000 },
    { month: 'Fev', receita: 82000, despesa: 66000 },
    { month: 'Mar', receita: 85000, despesa: 67000 },
    { month: 'Abr', receita: 83000, despesa: 66500 },
    { month: 'Mai', receita: 85000, despesa: 67500 },
    { month: 'Jun', receita: 87200, despesa: 68500 }
  ],
  'barra': [
    { month: 'Jan', receita: 58000, despesa: 44000 },
    { month: 'Fev', receita: 61000, despesa: 45000 },
    { month: 'Mar', receita: 63000, despesa: 46000 },
    { month: 'Abr', receita: 62000, despesa: 46500 },
    { month: 'Mai', receita: 64000, despesa: 47500 },
    { month: 'Jun', receita: 65280, despesa: 48700 }
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
