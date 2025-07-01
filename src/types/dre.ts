
import { Account } from './chartOfAccounts';
import { CostCenterCategory } from './costCenter';

export interface DRELineItem {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: 'revenue' | 'expense' | 'subtotal' | 'total';
  level: number;
  parentId?: string;
  accounts: string[]; // Account IDs from chart of accounts
  costCenters: string[]; // Cost center IDs
  formula?: string; // Custom formula for calculated lines
  isCalculated: boolean;
  isVisible: boolean;
  order: number;
  value?: number;
  percentageOfRevenue?: number;
  variance?: number;
  variancePercentage?: number;
}

export interface DRETemplate {
  id: string;
  name: string;
  description: string;
  structure: DRELineItem[];
  isDefault: boolean;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface DREConfiguration {
  templateId: string;
  period: {
    startDate: Date;
    endDate: Date;
    comparisonPeriod?: {
      startDate: Date;
      endDate: Date;
    };
  };
  units: string[];
  costCenters: string[];
  filters: {
    includeInactive: boolean;
    minimumAmount?: number;
    excludeZeroValues: boolean;
  };
  displayOptions: {
    showPercentages: boolean;
    showVariance: boolean;
    showComparison: boolean;
    currency: string;
    decimalPlaces: number;
  };
}

export interface DREData {
  configuration: DREConfiguration;
  lineItems: DRELineItem[];
  totals: {
    totalRevenue: number;
    totalExpenses: number;
    grossProfit: number;
    netProfit: number;
    ebitda: number;
    margins: {
      gross: number;
      net: number;
      ebitda: number;
    };
  };
  metadata: {
    generatedAt: Date;
    generatedBy: string;
    dataSource: string;
  };
}

export interface DREAnalysis {
  trends: {
    revenueGrowth: number;
    expenseGrowth: number;
    marginTrend: 'improving' | 'stable' | 'declining';
  };
  insights: {
    type: 'positive' | 'negative' | 'neutral';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
  }[];
  recommendations: string[];
}
