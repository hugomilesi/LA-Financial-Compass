import { supabase } from '@/integrations/supabase/client';
import { CostCenterCategory, CostCenterAlert } from '@/types/costCenter';

export const DEFAULT_COST_CENTER_CATEGORIES: CostCenterCategory[] = [
  {
    id: '1',
    name: 'Pessoal',
    description: 'Despesas relacionadas a salários, encargos e benefícios de funcionários.',
    type: 'expense',
    isEssential: true,
    isActive: true,
    totalAmount: 0,
    percentage: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Aluguel e Ocupação',
    description: 'Custos com aluguel, condomínio, IPTU e outras despesas de ocupação.',
    type: 'expense',
    isEssential: true,
    isActive: true,
    totalAmount: 0,
    percentage: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Marketing e Comunicação',
    description: 'Investimentos em publicidade, campanhas e comunicação.',
    type: 'expense',
    isEssential: false,
    isActive: true,
    totalAmount: 0,
    percentage: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Tecnologia',
    description: 'Gastos com softwares, hardwares, licenças e serviços de TI.',
    type: 'expense',
    isEssential: true,
    isActive: true,
    totalAmount: 0,
    percentage: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Manutenção',
    description: 'Despesas com reparos, conservação e manutenção de equipamentos e instalações.',
    type: 'expense',
    isEssential: true,
    isActive: true,
    totalAmount: 0,
    percentage: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'Administrativa',
    description: 'Custos com materiais de escritório, serviços de apoio e outras despesas administrativas.',
    type: 'expense',
    isEssential: true,
    isActive: true,
    totalAmount: 0,
    percentage: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '7',
    name: 'Despesas Operacionais',
    description: 'Custos diretos relacionados à operação principal do negócio.',
    type: 'expense',
    isEssential: true,
    isActive: true,
    totalAmount: 0,
    percentage: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    categoryId: '8',
    name: 'Outros',
    description: 'Categorias de despesas diversas não classificadas nas anteriores.',
    type: 'expense',
    isEssential: false,
    isActive: true,
    totalAmount: 0,
    percentage: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const getCostCenterCategories = async (): Promise<CostCenterCategory[]> => {
    const { data, error } = await supabase.from('cost_center_categories').select('*');

    if (error) {
        
        return [];
    }
    return data.map(category => ({
        categoryId: category.category_id,
        name: category.category_name,
        description: category.description,
        type: category.type,
        isEssential: category.isEssential,
        isActive: category.isActive,
        totalAmount: category.totalAmount,
        percentage: category.percentage,
        createdAt: category.created_at,
        updatedAt: category.updated_at,
    }));
};

export const getCostCenterDataByUnit = async (unitId: string) => {
    let costCentersQuery = supabase
        .from('cost_centers')
        .select('*');

    if (unitId !== 'all') {
        costCentersQuery = costCentersQuery.eq('unit_id', unitId);
    }

    const { data: costCentersData, error: costCentersError } = await costCentersQuery;

    if (costCentersError) {
        
        return [];
    }

    const { data: categoriesData, error: categoriesError } = await supabase
        .from('cost_center_categories')
        .select('category_id, category_name');

    if (categoriesError) {
        
        return [];
    }

    const categoryMap = new Map(categoriesData.map(cat => [cat.category_id, cat.category_name]));

    return costCentersData.map(item => ({
        name: categoryMap.get(item.category_id) || 'Unknown Category',
        amount: item.amount,
        value: item.value
    }));
};

export const generateSmartAlerts = (categories: CostCenterCategory[]): CostCenterAlert[] => {
  // Placeholder for smart alert generation logic
  // This function would typically analyze category data and generate alerts based on predefined rules
  
  const alerts: CostCenterAlert[] = [];

  // Example: Alert if 'Pessoal' expenses are too high
  const pessoalCategory = categories.find(cat => cat.name === 'Pessoal');
  if (pessoalCategory && pessoalCategory.percentage > 60) {
    alerts.push({
      id: 'pessoal-high',
      type: 'warning',
      message: `As despesas com Pessoal (${pessoalCategory.percentage.toFixed(1)}%) estão acima do ideal.`,
      category: 'Pessoal',
      createdAt: new Date(),
      isRead: false,
    });
  }

  // Example: Alert if 'Marketing' expenses are too low
  const marketingCategory = categories.find(cat => cat.name === 'Marketing e Comunicação');
  if (marketingCategory && marketingCategory.percentage < 5) {
    alerts.push({
      id: 'marketing-low',
      type: 'info',
      message: `O investimento em Marketing (${marketingCategory.percentage.toFixed(1)}%) parece baixo. Considere aumentar para impulsionar o crescimento.`,
      category: 'Marketing e Comunicação',
      createdAt: new Date(),
      isRead: false,
    });
  }

  return alerts;
};
