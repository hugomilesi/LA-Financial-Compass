
import { CostCenterCategory } from '@/types/costCenter';

export const DEFAULT_COST_CENTER_CATEGORIES: CostCenterCategory[] = [
  {
    id: 'cc-pessoal',
    name: 'Pessoal',
    description: 'Salários, encargos sociais e benefícios dos colaboradores',
    color: '#EF4444',
    icon: 'Users',
    isActive: true,
    totalAmount: 165519,
    percentage: 52.1,
    unitBreakdown: [
      { unitId: 'campo-grande', unitName: 'Campo Grande', amount: 68451, percentage: 60.1 },
      { unitId: 'recreio', unitName: 'Recreio', amount: 58100, percentage: 57.2 },
      { unitId: 'barra', unitName: 'Barra', amount: 38968, percentage: 55.8 }
    ],
    accounts: ['exp-4.1.1.1', 'exp-4.2.1.1'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-06-15')
  },
  {
    id: 'cc-aluguel',
    name: 'Aluguel e Ocupação',
    description: 'Aluguel, condomínio e taxas relacionadas ao espaço físico',
    color: '#F59E0B',
    icon: 'Building',
    isActive: true,
    totalAmount: 52405,
    percentage: 16.5,
    unitBreakdown: [
      { unitId: 'campo-grande', unitName: 'Campo Grande', amount: 19938, percentage: 17.5 },
      { unitId: 'recreio', unitName: 'Recreio', amount: 19401, percentage: 19.1 },
      { unitId: 'barra', unitName: 'Barra', amount: 13066, percentage: 18.7 }
    ],
    accounts: ['exp-4.1.2.1.1', 'exp-4.1.2.1.2', 'exp-4.1.2.2.1', 'exp-4.1.2.2.2', 'exp-4.1.2.3.1', 'exp-4.1.2.3.2'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-06-15')
  },
  {
    id: 'cc-marketing',
    name: 'Marketing e Comunicação',
    description: 'Publicidade, material gráfico e eventos promocionais',
    color: '#10B981',
    icon: 'Megaphone',
    isActive: true,
    totalAmount: 38217,
    percentage: 12.0,
    unitBreakdown: [
      { unitId: 'campo-grande', unitName: 'Campo Grande', amount: 14583, percentage: 12.8 },
      { unitId: 'recreio', unitName: 'Recreio', amount: 13712, percentage: 13.5 },
      { unitId: 'barra', unitName: 'Barra', amount: 9922, percentage: 14.2 }
    ],
    accounts: ['exp-4.2.2.1', 'exp-4.2.2.2', 'exp-4.2.2.3'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-06-15')
  },
  {
    id: 'cc-tecnologia',
    name: 'Tecnologia',
    description: 'Software, hardware, licenças e infraestrutura de TI',
    color: '#3B82F6',
    icon: 'Monitor',
    isActive: true,
    totalAmount: 28950,
    percentage: 9.1,
    unitBreakdown: [
      { unitId: 'campo-grande', unitName: 'Campo Grande', amount: 11580, percentage: 10.2 },
      { unitId: 'recreio', unitName: 'Recreio', amount: 10440, percentage: 10.3 },
      { unitId: 'barra', unitName: 'Barra', amount: 6930, percentage: 9.9 }
    ],
    accounts: ['exp-4.2.3.1', 'exp-4.2.3.2'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-06-15')
  },
  {
    id: 'cc-manutencao',
    name: 'Manutenção',
    description: 'Reparos, conservação e manutenção preventiva',
    color: '#8B5CF6',
    icon: 'Wrench',
    isActive: true,
    totalAmount: 19680,
    percentage: 6.2,
    unitBreakdown: [
      { unitId: 'campo-grande', unitName: 'Campo Grande', amount: 7872, percentage: 6.9 },
      { unitId: 'recreio', unitName: 'Recreio', amount: 7077, percentage: 7.0 },
      { unitId: 'barra', unitName: 'Barra', amount: 4731, percentage: 6.8 }
    ],
    accounts: ['exp-4.1.2.1.4', 'exp-4.1.2.2.4', 'exp-4.1.2.3.4'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-06-15')
  },
  {
    id: 'cc-administrativa',
    name: 'Administrativa',
    description: 'Despesas administrativas, contabilidade e consultoria',
    color: '#06B6D4',
    icon: 'FileText',
    isActive: true,
    totalAmount: 15840,
    percentage: 5.0,
    unitBreakdown: [
      { unitId: 'campo-grande', unitName: 'Campo Grande', amount: 6336, percentage: 5.6 },
      { unitId: 'recreio', unitName: 'Recreio', amount: 5702, percentage: 5.6 },
      { unitId: 'barra', unitName: 'Barra', amount: 3802, percentage: 5.4 }
    ],
    accounts: ['exp-4.2.5.1', 'exp-4.2.5.2'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-06-15')
  },
  {
    id: 'cc-operacional',
    name: 'Despesas Operacionais',
    description: 'Utilities, material de ensino e despesas gerais',
    color: '#84CC16',
    icon: 'Settings',
    isActive: true,
    totalAmount: 23893,
    percentage: 7.5,
    unitBreakdown: [
      { unitId: 'campo-grande', unitName: 'Campo Grande', amount: 9001, percentage: 7.9 },
      { unitId: 'recreio', unitName: 'Recreio', amount: 8532, percentage: 8.4 },
      { unitId: 'barra', unitName: 'Barra', amount: 6360, percentage: 9.1 }
    ],
    accounts: ['exp-4.1.2.1.3', 'exp-4.1.2.2.3', 'exp-4.1.2.3.3', 'exp-4.1.1.2', 'exp-4.2.4'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-06-15')
  },
  {
    id: 'cc-outros',
    name: 'Outros',
    description: 'Despesas diversas e não categorizadas',
    color: '#6B7280',
    icon: 'MoreHorizontal',
    isActive: true,
    totalAmount: 5341,
    percentage: 1.7,
    unitBreakdown: [
      { unitId: 'campo-grande', unitName: 'Campo Grande', amount: 1957, percentage: 1.7 },
      { unitId: 'recreio', unitName: 'Recreio', amount: 1829, percentage: 1.8 },
      { unitId: 'barra', unitName: 'Barra', amount: 1555, percentage: 2.2 }
    ],
    accounts: ['exp-4.3'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-06-15')
  }
];

export interface CostCenterAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  title: string;
  message: string;
  categoryId?: string;
  unitId?: string;
  threshold?: number;
  currentValue?: number;
  createdAt: Date;
  isRead: boolean;
}

export const generateSmartAlerts = (categories: CostCenterCategory[]): CostCenterAlert[] => {
  const alerts: CostCenterAlert[] = [];
  
  // Alerta para categoria com crescimento alto
  const highGrowthCategory = categories.find(cat => cat.percentage > 50);
  if (highGrowthCategory) {
    alerts.push({
      id: 'alert-high-growth',
      type: 'warning',
      title: 'Categoria com Alto Percentual',
      message: `A categoria "${highGrowthCategory.name}" representa ${highGrowthCategory.percentage.toFixed(1)}% dos custos totais.`,
      categoryId: highGrowthCategory.id,
      threshold: 50,
      currentValue: highGrowthCategory.percentage,
      createdAt: new Date(),
      isRead: false
    });
  }

  // Alerta para categorias com baixo investimento
  const lowInvestmentCategories = categories.filter(cat => cat.percentage < 3 && cat.isActive);
  lowInvestmentCategories.forEach(cat => {
    alerts.push({
      id: `alert-low-investment-${cat.id}`,
      type: 'info',
      title: 'Categoria com Baixo Investimento',
      message: `A categoria "${cat.name}" representa apenas ${cat.percentage.toFixed(1)}% dos custos totais.`,
      categoryId: cat.id,
      threshold: 3,
      currentValue: cat.percentage,
      createdAt: new Date(),
      isRead: false
    });
  });

  // Alerta para variação entre unidades
  categories.forEach(category => {
    const percentages = category.unitBreakdown.map(unit => unit.percentage);
    const maxPercentage = Math.max(...percentages);
    const minPercentage = Math.min(...percentages);
    const variation = maxPercentage - minPercentage;
    
    if (variation > 5) {
      alerts.push({
        id: `alert-unit-variation-${category.id}`,
        type: 'warning',
        title: 'Variação Significativa entre Unidades',
        message: `A categoria "${category.name}" apresenta variação de ${variation.toFixed(1)}% entre as unidades.`,
        categoryId: category.id,
        threshold: 5,
        currentValue: variation,
        createdAt: new Date(),
        isRead: false
      });
    }
  });

  return alerts;
};
