import { UNITS } from '@/contexts/UnitContext';

export interface KPIData {
  id: string;
  title: string;
  value: string;
  change: number;
  icon: string;
  color: string;
  description: string;
  unit: string;
}

// Updated KPI data by unit with new real-world values
const unitKPIData = {
  'campo-grande': {
    cac: 290.07,
    crc: 83.55,
    ltv: 5406,
    permanencia: 19, // months
    churnRate: 4.5 // percentage
  },
  'recreio': {
    cac: 280.20,
    crc: 145.75,
    ltv: 3850,
    permanencia: 19.8,
    churnRate: 4.7 // percentage
  },
  'barra': {
    cac: 298.50,
    crc: 156.90,
    ltv: 4650,
    permanencia: 25.1,
    churnRate: 2.8 // percentage
  }
};

// Updated historical data by unit for charts with new realistic trends
const unitHistoricalData = {
  'campo-grande': [
    { month: 'Jan', cac: 305.20, crc: 89.30, ltv: 5200, churnRate: 4.9, ltvCacRatio: 17.0 },
    { month: 'Fev', cac: 302.15, crc: 87.80, ltv: 5250, churnRate: 4.8, ltvCacRatio: 17.4 },
    { month: 'Mar', cac: 298.50, crc: 86.20, ltv: 5300, churnRate: 4.7, ltvCacRatio: 17.7 },
    { month: 'Abr', cac: 295.80, crc: 85.10, ltv: 5350, churnRate: 4.6, ltvCacRatio: 18.1 },
    { month: 'Mai', cac: 292.90, crc: 84.30, ltv: 5380, churnRate: 4.5, ltvCacRatio: 18.4 },
    { month: 'Jun', cac: 290.07, crc: 83.55, ltv: 5406, churnRate: 4.5, ltvCacRatio: 18.6 }
  ],
  'recreio': [
    { month: 'Jan', cac: 285.40, crc: 148.30, ltv: 3720, churnRate: 5.2, ltvCacRatio: 13.0 },
    { month: 'Fev', cac: 284.10, crc: 147.80, ltv: 3750, churnRate: 5.0, ltvCacRatio: 13.2 },
    { month: 'Mar', cac: 282.80, crc: 147.20, ltv: 3780, churnRate: 4.9, ltvCacRatio: 13.4 },
    { month: 'Abr', cac: 281.60, crc: 146.50, ltv: 3810, churnRate: 4.8, ltvCacRatio: 13.5 },
    { month: 'Mai', cac: 280.90, crc: 146.10, ltv: 3830, churnRate: 4.7, ltvCacRatio: 13.6 },
    { month: 'Jun', cac: 280.20, crc: 145.75, ltv: 3850, churnRate: 4.7, ltvCacRatio: 13.7 }
  ],
  'barra': [
    { month: 'Jan', cac: 305.80, crc: 162.40, ltv: 4480, churnRate: 3.2, ltvCacRatio: 14.6 },
    { month: 'Fev', cac: 304.20, crc: 161.80, ltv: 4520, churnRate: 3.1, ltvCacRatio: 14.9 },
    { month: 'Mar', cac: 302.10, crc: 160.90, ltv: 4560, churnRate: 3.0, ltvCacRatio: 15.1 },
    { month: 'Abr', cac: 300.50, crc: 159.80, ltv: 4590, churnRate: 2.9, ltvCacRatio: 15.3 },
    { month: 'Mai', cac: 299.40, crc: 158.20, ltv: 4620, churnRate: 2.8, ltvCacRatio: 15.4 },
    { month: 'Jun', cac: 298.50, crc: 156.90, ltv: 4650, churnRate: 2.8, ltvCacRatio: 15.6 }
  ]
};

// Calculate consolidated historical data for "all" units
const getConsolidatedHistoricalData = () => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  return months.map(month => {
    const monthData = Object.values(unitHistoricalData).map(unitData => 
      unitData.find(data => data.month === month)!
    );
    
    const avgCac = monthData.reduce((sum, data) => sum + data.cac, 0) / monthData.length;
    const avgCrc = monthData.reduce((sum, data) => sum + data.crc, 0) / monthData.length;
    const avgLtv = monthData.reduce((sum, data) => sum + data.ltv, 0) / monthData.length;
    const avgChurnRate = monthData.reduce((sum, data) => sum + data.churnRate, 0) / monthData.length;
    
    return {
      month,
      cac: Math.round(avgCac * 100) / 100,
      crc: Math.round(avgCrc * 100) / 100,
      ltv: Math.round(avgLtv),
      churnRate: Math.round(avgChurnRate * 10) / 10,
      ltvCacRatio: Math.round((avgLtv / avgCac) * 10) / 10
    };
  });
};

const allUnitsHistoricalData = getConsolidatedHistoricalData();

// Calculate consolidated data for "all" units (average of the three units)
const getConsolidatedKPIs = () => {
  const units = Object.values(unitKPIData);
  const count = units.length;
  
  return {
    cac: Math.round((units.reduce((sum, unit) => sum + unit.cac, 0) / count) * 100) / 100,
    crc: Math.round((units.reduce((sum, unit) => sum + unit.crc, 0) / count) * 100) / 100,
    ltv: Math.round(units.reduce((sum, unit) => sum + unit.ltv, 0) / count),
    permanencia: Math.round((units.reduce((sum, unit) => sum + unit.permanencia, 0) / count) * 10) / 10,
    churnRate: Math.round((units.reduce((sum, unit) => sum + unit.churnRate, 0) / count) * 10) / 10
  };
};

const allUnitsData = getConsolidatedKPIs();

export const getKPIsByUnit = (unitId: string): KPIData[] => {
  console.log('📊 [kpiData.getKPIsByUnit] Getting KPIs for unit:', unitId);
  
  let data;
  let unitName;
  
  if (unitId === 'all') {
    data = allUnitsData;
    unitName = 'Consolidado';
  } else {
    data = unitKPIData[unitId as keyof typeof unitKPIData] || unitKPIData['campo-grande'];
    const unit = UNITS.find(u => u.id === unitId);
    unitName = unit?.displayName || 'Campo Grande';
  }
  
  // Generate realistic month-over-month changes
  const generateChange = (base: number) => {
    return Math.round((Math.random() * 10 - 5) * 10) / 10; // -5% to +5%
  };
  
  const kpis: KPIData[] = [
    {
      id: 'cac',
      title: 'CAC',
      value: `R$ ${data.cac.toFixed(2)}`,
      change: generateChange(data.cac),
      icon: 'DollarSign',
      color: '#EF4444',
      description: 'Custo de Aquisição de Cliente',
      unit: unitName
    },
    {
      id: 'crc',
      title: 'CRC',
      value: `R$ ${data.crc.toFixed(2)}`,
      change: generateChange(data.crc),
      icon: 'CreditCard',
      color: '#8B5CF6',
      description: 'Custo de Retenção de Cliente',
      unit: unitName
    },
    {
      id: 'ltv',
      title: 'LTV',
      value: `R$ ${data.ltv.toLocaleString()}`,
      change: generateChange(data.ltv / 100),
      icon: 'TrendingUp',
      color: '#10B981',
      description: 'Lifetime Value do Cliente',
      unit: unitName
    },
    {
      id: 'churn-rate',
      title: 'Churn Rate',
      value: `${data.churnRate.toFixed(1)}%`,
      change: generateChange(data.churnRate),
      icon: 'TrendingDown',
      color: '#F59E0B',
      description: 'Taxa de Cancelamento de Clientes',
      unit: unitName
    },
    {
      id: 'permanencia',
      title: 'Tempo de Permanência',
      value: `${data.permanencia} meses`,
      change: generateChange(data.permanencia),
      icon: 'Clock',
      color: '#3B82F6',
      description: 'Tempo médio de permanência do aluno',
      unit: unitName
    }
  ];
  
  console.log('📈 [kpiData.getKPIsByUnit] Generated KPIs:', kpis);
  return kpis;
};

export const getHistoricalDataByUnit = (unitId: string) => {
  console.log('📊 [kpiData.getHistoricalDataByUnit] Getting historical data for unit:', unitId);
  
  if (unitId === 'all') {
    return allUnitsHistoricalData;
  }
  
  return unitHistoricalData[unitId as keyof typeof unitHistoricalData] || unitHistoricalData['campo-grande'];
};

export const getKPIDetails = (kpiId: string, unitId: string) => {
  console.log('🔍 [kpiData.getKPIDetails] Getting details for KPI:', kpiId, 'Unit:', unitId);
  
  const kpis = getKPIsByUnit(unitId);
  const kpi = kpis.find(k => k.id === kpiId);
  
  if (!kpi) return null;
  
  // Generate detailed data based on KPI type
  const getDetailedData = () => {
    switch (kpiId) {
      case 'cac':
        return {
          currentValue: kpi.value,
          target: 'R$ 220,00',
          trend: 'Estável',
          factors: [
            'Investimento em marketing digital',
            'Campanhas de indicação',
            'Otimização de landing pages'
          ],
          recommendations: [
            'Focar em canais de menor custo',
            'Implementar programa de referência',
            'Melhorar taxa de conversão'
          ]
        };
      
      case 'crc':
        return {
          currentValue: kpi.value,
          target: 'R$ 120,00',
          trend: 'Crescendo',
          factors: [
            'Programas de fidelização',
            'Atendimento personalizado',
            'Benefícios exclusivos'
          ],
          recommendations: [
            'Automatizar campanhas de retenção',
            'Melhorar experiência do cliente',
            'Oferecer incentivos direcionados'
          ]
        };
      
      case 'ltv':
        return {
          currentValue: kpi.value,
          target: 'R$ 4.500',
          trend: 'Crescendo',
          factors: [
            'Retenção de alunos',
            'Upselling de serviços',
            'Fidelização'
          ],
          recommendations: [
            'Aumentar engajamento',
            'Oferecer serviços premium',
            'Melhorar experiência'
          ]
        };
      
      case 'permanencia':
        return {
          currentValue: kpi.value,
          target: '24 meses',
          trend: 'Estável',
          factors: [
            'Qualidade do ensino',
            'Relacionamento com alunos',
            'Infraestrutura'
          ],
          recommendations: [
            'Melhorar acompanhamento',
            'Diversificar atividades',
            'Fortalecer comunidade'
          ]
        };
      
      case 'churn-rate':
        return {
          currentValue: kpi.value,
          target: '2,5%',
          trend: 'Decrescendo',
          factors: [
            'Satisfação do cliente',
            'Qualidade do serviço',
            'Preço competitivo'
          ],
          recommendations: [
            'Melhorar atendimento',
            'Implementar pesquisas de satisfação',
            'Criar programas de fidelidade'
          ]
        };
      
      default:
        return null;
    }
  };
  
  return {
    ...kpi,
    details: getDetailedData()
  };
};
