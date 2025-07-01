
import { useState, useEffect } from 'react';
import { CostCenterCategory, CostCenterMetrics } from '@/types/costCenter';
import { UNIT_COST_CENTER_DATA, UNIT_DATA } from '@/utils/unitData';

const STORAGE_KEY = 'la-music-cost-center-categories';

const defaultCategories: CostCenterCategory[] = [
  {
    id: 'cc-pessoal',
    name: 'Pessoal',
    description: 'Salários, encargos sociais e benefícios dos colaboradores',
    color: '#EF4444',
    icon: 'Users',
    isActive: true,
    totalAmount: 165519,
    percentage: 58.1,
    unitBreakdown: [
      { unitId: 'campo-grande', unitName: 'Campo Grande', amount: 68451, percentage: 60.1 },
      { unitId: 'recreio', unitName: 'Recreio', amount: 58100, percentage: 57.2 },
      { unitId: 'barra', unitName: 'Barra', amount: 38968, percentage: 55.8 }
    ],
    accounts: ['exp-4.1.1.1', 'exp-4.2.1.1'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'cc-aluguel',
    name: 'Aluguel e Ocupação',
    description: 'Aluguel, condomínio e taxas relacionadas ao espaço físico',
    color: '#F59E0B',
    icon: 'Building',
    isActive: true,
    totalAmount: 52405,
    percentage: 18.4,
    unitBreakdown: [
      { unitId: 'campo-grande', unitName: 'Campo Grande', amount: 19938, percentage: 17.5 },
      { unitId: 'recreio', unitName: 'Recreio', amount: 19401, percentage: 19.1 },
      { unitId: 'barra', unitName: 'Barra', amount: 13066, percentage: 18.7 }
    ],
    accounts: ['exp-4.1.2.1.1', 'exp-4.1.2.1.2', 'exp-4.1.2.2.1', 'exp-4.1.2.2.2', 'exp-4.1.2.3.1', 'exp-4.1.2.3.2'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'cc-marketing',
    name: 'Marketing e Comunicação',
    description: 'Publicidade, material gráfico e eventos promocionais',
    color: '#10B981',
    icon: 'Megaphone',
    isActive: true,
    totalAmount: 38217,
    percentage: 13.4,
    unitBreakdown: [
      { unitId: 'campo-grande', unitName: 'Campo Grande', amount: 14583, percentage: 12.8 },
      { unitId: 'recreio', unitName: 'Recreio', amount: 13712, percentage: 13.5 },
      { unitId: 'barra', unitName: 'Barra', amount: 9922, percentage: 14.2 }
    ],
    accounts: ['exp-4.2.2.1', 'exp-4.2.2.2', 'exp-4.2.2.3'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'cc-operacional',
    name: 'Despesas Operacionais',
    description: 'Utilities, material de ensino e despesas gerais',
    color: '#3B82F6',
    icon: 'Settings',
    isActive: true,
    totalAmount: 23893,
    percentage: 8.4,
    unitBreakdown: [
      { unitId: 'campo-grande', unitName: 'Campo Grande', amount: 9001, percentage: 7.9 },
      { unitId: 'recreio', unitName: 'Recreio', amount: 8532, percentage: 8.4 },
      { unitId: 'barra', unitName: 'Barra', amount: 6360, percentage: 9.1 }
    ],
    accounts: ['exp-4.1.2.1.3', 'exp-4.1.2.2.3', 'exp-4.1.2.3.3', 'exp-4.1.1.2', 'exp-4.2.4'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'cc-outros',
    name: 'Outros',
    description: 'Despesas diversas e não categorizadas',
    color: '#6B7280',
    icon: 'MoreHorizontal',
    isActive: true,
    totalAmount: 5341,
    percentage: 1.9,
    unitBreakdown: [
      { unitId: 'campo-grande', unitName: 'Campo Grande', amount: 1957, percentage: 1.7 },
      { unitId: 'recreio', unitName: 'Recreio', amount: 1829, percentage: 1.8 },
      { unitId: 'barra', unitName: 'Barra', amount: 1555, percentage: 2.2 }
    ],
    accounts: ['exp-4.3'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const useCostCenterCategories = () => {
  const [categories, setCategories] = useState<CostCenterCategory[]>([]);

  useEffect(() => {
    const storedCategories = localStorage.getItem(STORAGE_KEY);
    if (storedCategories) {
      try {
        const parsed = JSON.parse(storedCategories);
        setCategories(parsed.map((category: any) => ({
          ...category,
          createdAt: new Date(category.createdAt),
          updatedAt: new Date(category.updatedAt)
        })));
      } catch (error) {
        console.error('Error parsing stored categories:', error);
        setCategories(defaultCategories);
      }
    } else {
      setCategories(defaultCategories);
    }
  }, []);

  const saveToStorage = (updatedCategories: CostCenterCategory[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCategories));
    setCategories(updatedCategories);
  };

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const addCategory = (categoryData: Omit<CostCenterCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCategory: CostCenterCategory = {
      ...categoryData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedCategories = [...categories, newCategory];
    saveToStorage(updatedCategories);
  };

  const updateCategory = (id: string, categoryData: Partial<Omit<CostCenterCategory, 'id' | 'createdAt'>>) => {
    const updatedCategories = categories.map(category => 
      category.id === id 
        ? { ...category, ...categoryData, updatedAt: new Date() }
        : category
    );
    saveToStorage(updatedCategories);
  };

  const deleteCategory = (id: string) => {
    const updatedCategories = categories.filter(category => category.id !== id);
    saveToStorage(updatedCategories);
  };

  const getCategoryMetrics = (): CostCenterMetrics => {
    const totalExpenses = categories.reduce((sum, cat) => sum + cat.totalAmount, 0);
    const activeCategories = categories.filter(cat => cat.isActive);
    
    const sortedByAmount = [...activeCategories].sort((a, b) => b.totalAmount - a.totalAmount);
    
    return {
      totalExpenses,
      categoryCount: activeCategories.length,
      averagePerCategory: totalExpenses / activeCategories.length,
      highestCategory: {
        name: sortedByAmount[0]?.name || '',
        amount: sortedByAmount[0]?.totalAmount || 0,
        percentage: sortedByAmount[0]?.percentage || 0
      },
      lowestCategory: {
        name: sortedByAmount[sortedByAmount.length - 1]?.name || '',
        amount: sortedByAmount[sortedByAmount.length - 1]?.totalAmount || 0,
        percentage: sortedByAmount[sortedByAmount.length - 1]?.percentage || 0
      },
      monthlyGrowth: 2.3 // This would come from historical data in a real app
    };
  };

  const getCategoriesByUnit = (unitId: string) => {
    if (unitId === 'all') {
      return categories;
    }
    
    return categories.map(category => ({
      ...category,
      totalAmount: category.unitBreakdown.find(u => u.unitId === unitId)?.amount || 0,
      percentage: category.unitBreakdown.find(u => u.unitId === unitId)?.percentage || 0
    }));
  };

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryMetrics,
    getCategoriesByUnit
  };
};
