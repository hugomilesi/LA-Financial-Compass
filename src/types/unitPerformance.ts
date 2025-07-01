
export interface UnitPerformanceData {
  unitId: string;
  unitName: string;
  financial: {
    revenue: number;
    expenses: number;
    profit: number;
    profitMargin: number;
    costPerStudent: number;
    revenueGrowth: number;
  };
  operational: {
    students: number;
    enrollments: number;
    capacity: number;
    occupancy: number;
    averageTicket: number;
    studentRetention: number;
  };
  strategic: {
    marketShare: number;
    customerSatisfaction: number;
    teacherSatisfaction: number;
    digitalEngagement: number;
    brandAwareness: number;
  };
  trends: {
    revenueHistory: Array<{ month: string; value: number }>;
    studentsHistory: Array<{ month: string; value: number }>;
    profitHistory: Array<{ month: string; value: number }>;
  };
  alerts: UnitAlert[];
}

export interface UnitAlert {
  id: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  category: 'financial' | 'operational' | 'strategic';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface UnitComparison {
  metric: string;
  category: 'financial' | 'operational' | 'strategic';
  units: Array<{
    unitId: string;
    unitName: string;
    value: number;
    rank: number;
    change: number;
  }>;
}

export interface UnitRanking {
  unitId: string;
  unitName: string;
  overallScore: number;
  rank: number;
  financialScore: number;
  operationalScore: number;
  strategicScore: number;
  trend: 'up' | 'down' | 'stable';
}
