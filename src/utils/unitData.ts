


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
    despesa: 113930,
    alunos: 800, // Valor correto fornecido pelo usuário
    matriculas: 67,
    ticketMedio: 182, // Valor correto: 145320/800 = 181.65, arredondado para 182
    capacidade: 950,
    ocupacao: 84 // 800/950 = 84.2%, arredondado para 84%
  },
  'recreio': {
    receita: 128544,
    despesa: 101574,
    alunos: 720, // Valor correto fornecido pelo usuário
    matriculas: 56,
    ticketMedio: 179, // Valor correto: 128544/720 = 178.53, arredondado para 179
    capacidade: 880,
    ocupacao: 82 // 720/880 = 81.8%, arredondado para 82%
  },
  'barra': {
    receita: 117591,
    despesa: 69871,
    alunos: 467, // Valor correto fornecido pelo usuário
    matriculas: 50,
    ticketMedio: 252, // Valor correto: 117591/467 = 251.8, arredondado para 252
    capacidade: 990,
    ocupacao: 47 // 467/990 = 47.2%, arredondado para 47%
  }
};

// Historical data by unit - updated to match new expense values with proportional adjustments
export const UNIT_HISTORICAL_DATA: Record<string, Array<{month: string, receita: number, despesa: number}>> = {
  'campo-grande': [
    { month: 'Jan', receita: 129800, despesa: 106964 },
    { month: 'Fev', receita: 135600, despesa: 109716 },
    { month: 'Mar', receita: 140100, despesa: 112242 },
    { month: 'Abr', receita: 138700, despesa: 111304 },
    { month: 'Mai', receita: 141500, despesa: 112681 },
    { month: 'Jun', receita: 145320, despesa: 113930 }
  ],
  'recreio': [
    { month: 'Jan', receita: 114900, despesa: 95366 },
    { month: 'Fev', receita: 120900, despesa: 97925 },
    { month: 'Mar', receita: 125400, despesa: 99807 },
    { month: 'Abr', receita: 122400, despesa: 98867 },
    { month: 'Mai', receita: 125400, despesa: 100286 },
    { month: 'Jun', receita: 128544, despesa: 101574 }
  ],
  'barra': [
    { month: 'Jan', receita: 104600, despesa: 65473 },
    { month: 'Fev', receita: 109900, despesa: 67007 },
    { month: 'Mar', receita: 113600, despesa: 68252 },
    { month: 'Abr', receita: 111800, despesa: 67714 },
    { month: 'Mai', receita: 115400, despesa: 68851 },
    { month: 'Jun', receita: 117591, despesa: 69871 }
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
