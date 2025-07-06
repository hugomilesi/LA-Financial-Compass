
export interface CostCenterCategory {
  categoryId: string;
  name: string;
  description: string;
  type: 'income' | 'expense';
  color?: string;
  icon?: string;
  isActive: boolean;
  totalAmount: number;
  percentage: number;
  unitBreakdown?: {
    unitId: string;
    unitName: string;
    amount: number;
    percentage: number;
  }[];
  accounts?: string[]; // Array of account IDs from chart of accounts
  createdAt: Date;
  updatedAt: Date;
}

export interface CostCenterMetrics {
  totalExpenses: number;
  categoryCount: number;
  averagePerCategory: number;
  highestCategory: {
    name: string;
    amount: number;
    percentage: number;
  };
  lowestCategory: {
    name: string;
    amount: number;
    percentage: number;
  };
  monthlyGrowth: number;
}

export interface CostCenterFormData {
  name: string;
  description: string;
  type: 'income' | 'expense';
  color?: string;
  icon?: string;
  isActive: boolean;
  accounts?: string[];
}

export interface UnitCostBreakdown {
  unitId: string;
  unitName: string;
  categories: {
    categoryId: string;
    categoryName: string;
    amount: number;
    percentage: number;
  }[];
  totalExpenses: number;
}
