
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

// Updated KPI data by unit with specific values from user requirements
const unitKPIData = {
  'campo-grande': {
    cac: 130.50,
    crc: 89.20,
    ltv: 2850,
    permanencia: 18.5, // months
    ltvCacRatio: 21.84 // LTV/CAC calculated as 2850/130.50
  },
  'recreio': {
    cac: 142.75,
    crc: 78.30,
    ltv: 2650,
    permanencia: 16.2,
    ltvCacRatio: 18.56 // LTV/CAC calculated as 2650/142.75
  },
  'barra': {
    cac: 138.90,
    crc: 92.10,
    ltv: 2920,
    permanencia: 19.8,
    ltvCacRatio: 21.02 // LTV/CAC calculated as 2920/138.90
  }
};

// Calculate consolidated data for "all" units (average of the three units)
const getConsolidatedKPIs = () => {
  const units = Object.values(unitKPIData);
  const count = units.length;
  
  return {
    cac: Math.round((units.reduce((sum, unit) => sum + unit.cac, 0) / count) * 100) / 100,
    crc: Math.round((units.reduce((sum, unit) => sum + unit.crc, 0) / count) * 100) / 100,
    ltv: Math.round(units.reduce((sum, unit) => sum + unit.ltv, 0) / count),
    permanencia: Math.round((units.reduce((sum, unit) => sum + unit.permanencia, 0) / count) * 10) / 10,
    ltvCacRatio: Math.round((units.reduce((sum, unit) => sum + unit.ltvCacRatio, 0) / count) * 100) / 100
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
      color: '#F59E0B',
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
      id: 'permanencia',
      title: 'Tempo de Permanência',
      value: `${data.permanencia} meses`,
      change: generateChange(data.permanencia),
      icon: 'Clock',
      color: '#3B82F6',
      description: 'Tempo médio de permanência do aluno',
      unit: unitName
    },
    {
      id: 'ltv-cac',
      title: 'LTV/CAC',
      value: `${data.ltvCacRatio.toFixed(2)}x`,
      change: generateChange(data.ltvCacRatio),
      icon: 'Target',
      color: '#8B5CF6',
      description: 'Relação entre Lifetime Value e Custo de Aquisição',
      unit: unitName
    }
  ];
  
  console.log('📈 [kpiData.getKPIsByUnit] Generated KPIs:', kpis);
  return kpis;
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
          target: 'R$ 75,00',
          trend: 'Crescendo',
          factors: [
            'Programas de retenção',
            'Suporte ao cliente',
            'Atividades de engajamento'
          ],
          recommendations: [
            'Automatizar comunicação',
            'Personalizar experiência',
            'Implementar feedback contínuo'
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
      
      case 'ltv-cac':
        return {
          currentValue: kpi.value,
          target: '25,00x',
          trend: 'Crescendo',
          factors: [
            'Eficiência na aquisição',
            'Retenção de clientes',
            'Otimização de custos'
          ],
          recommendations: [
            'Reduzir CAC',
            'Aumentar LTV',
            'Equilibrar investimentos'
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
