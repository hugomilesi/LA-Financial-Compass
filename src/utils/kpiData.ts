
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

// Updated KPI data by unit with specific values including CRC
const unitKPIData = {
  'campo-grande': {
    cac: 130.50,
    crc: 85.20, // Cost Retention Cost
    ltv: 2850,
    permanencia: 18.5, // months
    churnRate: 4.2 // percentage
  },
  'recreio': {
    cac: 142.75,
    crc: 92.40,
    ltv: 2650,
    permanencia: 16.2,
    churnRate: 5.8 // percentage
  },
  'barra': {
    cac: 138.90,
    crc: 88.60,
    ltv: 2920,
    permanencia: 19.8,
    churnRate: 3.9 // percentage
  }
};

// Historical data by unit for charts
const unitHistoricalData = {
  'campo-grande': [
    { month: 'Jan', cac: 135, crc: 88, ltv: 2750, churnRate: 4.8, ltvCacRatio: 20.4 },
    { month: 'Fev', cac: 132, crc: 86, ltv: 2780, churnRate: 4.6, ltvCacRatio: 21.1 },
    { month: 'Mar', cac: 128, crc: 84, ltv: 2820, churnRate: 4.4, ltvCacRatio: 22.0 },
    { month: 'Abr', cac: 130, crc: 85, ltv: 2840, churnRate: 4.3, ltvCacRatio: 21.8 },
    { month: 'Mai', cac: 129, crc: 84, ltv: 2860, churnRate: 4.1, ltvCacRatio: 22.2 },
    { month: 'Jun', cac: 130.5, crc: 85.2, ltv: 2850, churnRate: 4.2, ltvCacRatio: 21.8 }
  ],
  'recreio': [
    { month: 'Jan', cac: 148, crc: 95, ltv: 2580, churnRate: 6.5, ltvCacRatio: 17.4 },
    { month: 'Fev', cac: 145, crc: 94, ltv: 2600, churnRate: 6.2, ltvCacRatio: 17.9 },
    { month: 'Mar', cac: 144, crc: 93, ltv: 2620, churnRate: 6.0, ltvCacRatio: 18.2 },
    { month: 'Abr', cac: 143, crc: 92, ltv: 2630, churnRate: 5.9, ltvCacRatio: 18.4 },
    { month: 'Mai', cac: 142, crc: 91, ltv: 2640, churnRate: 5.8, ltvCacRatio: 18.6 },
    { month: 'Jun', cac: 142.75, crc: 92.4, ltv: 2650, churnRate: 5.8, ltvCacRatio: 18.6 }
  ],
  'barra': [
    { month: 'Jan', cac: 142, crc: 90, ltv: 2880, churnRate: 4.3, ltvCacRatio: 20.3 },
    { month: 'Fev', cac: 140, crc: 89, ltv: 2900, churnRate: 4.1, ltvCacRatio: 20.7 },
    { month: 'Mar', cac: 139, crc: 88, ltv: 2910, churnRate: 4.0, ltvCacRatio: 20.9 },
    { month: 'Abr', cac: 138, crc: 87, ltv: 2915, churnRate: 3.9, ltvCacRatio: 21.1 },
    { month: 'Mai', cac: 137, crc: 87, ltv: 2918, churnRate: 3.8, ltvCacRatio: 21.3 },
    { month: 'Jun', cac: 138.9, crc: 88.6, ltv: 2920, churnRate: 3.9, ltvCacRatio: 21.0 }
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
          target: 'R$ 120,00',
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
          target: 'R$ 80,00',
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
          target: 'R$ 3.000',
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
          target: '20 meses',
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
          target: '3,0%',
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
