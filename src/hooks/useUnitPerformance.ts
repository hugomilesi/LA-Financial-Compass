
import { useState, useEffect } from 'react';
import { UnitPerformanceData, UnitAlert, UnitComparison, UnitRanking } from '@/types/unitPerformance';
import { getDataByUnit, getHistoricalDataByUnit } from '@/utils/unitData';
import { UNITS } from '@/contexts/UnitContext';

export const useUnitPerformance = () => {
  const [performanceData, setPerformanceData] = useState<UnitPerformanceData[]>([]);
  const [comparisons, setComparisons] = useState<UnitComparison[]>([]);
  const [rankings, setRankings] = useState<UnitRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generatePerformanceData();
  }, []);

  const generatePerformanceData = () => {
    console.log('🔍 [useUnitPerformance] Generating performance data...');
    
    const data: UnitPerformanceData[] = UNITS.filter(unit => unit.id !== 'all').map(unit => {
      const unitData = getDataByUnit(unit.id);
      const historicalData = getHistoricalDataByUnit(unit.id);
      
      // Calculate financial metrics
      const profit = unitData.receita - unitData.despesa;
      const profitMargin = (profit / unitData.receita) * 100;
      const costPerStudent = unitData.despesa / unitData.alunos;
      const revenueGrowth = calculateGrowth(historicalData.map(h => h.receita));
      
      // Generate strategic metrics
      const strategic = generateStrategicMetrics(unit.id);
      
      // Generate alerts
      const alerts = generateUnitAlerts(unit.id, unitData, profitMargin);
      
      return {
        unitId: unit.id,
        unitName: unit.displayName,
        financial: {
          revenue: unitData.receita,
          expenses: unitData.despesa,
          profit,
          profitMargin,
          costPerStudent,
          revenueGrowth
        },
        operational: {
          students: unitData.alunos,
          enrollments: unitData.matriculas,
          capacity: unitData.capacidade,
          occupancy: unitData.ocupacao,
          averageTicket: unitData.ticketMedio,
          studentRetention: generateRetentionRate(unit.id)
        },
        strategic,
        trends: {
          revenueHistory: historicalData.map(h => ({ month: h.month, value: h.receita })),
          studentsHistory: generateStudentHistory(unit.id),
          profitHistory: historicalData.map(h => ({ month: h.month, value: h.receita - h.despesa }))
        },
        alerts
      };
    });

    setPerformanceData(data);
    generateComparisons(data);
    generateRankings(data);
    setIsLoading(false);
  };

  const calculateGrowth = (values: number[]): number => {
    if (values.length < 2) return 0;
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    return ((lastValue - firstValue) / firstValue) * 100;
  };

  const generateStrategicMetrics = (unitId: string) => {
    const baseMetrics = {
      'campo-grande': { marketShare: 28, satisfaction: 87, teacher: 82, digital: 75, brand: 72 },
      'recreio': { marketShare: 22, satisfaction: 91, teacher: 88, digital: 82, brand: 78 },
      'barra': { marketShare: 18, satisfaction: 89, teacher: 85, digital: 79, brand: 74 }
    };

    const metrics = baseMetrics[unitId as keyof typeof baseMetrics] || baseMetrics['campo-grande'];
    
    return {
      marketShare: metrics.marketShare,
      customerSatisfaction: metrics.satisfaction,
      teacherSatisfaction: metrics.teacher,
      digitalEngagement: metrics.digital,
      brandAwareness: metrics.brand
    };
  };

  const generateRetentionRate = (unitId: string): number => {
    const rates = {
      'campo-grande': 89,
      'recreio': 92,
      'barra': 87
    };
    return rates[unitId as keyof typeof rates] || 85;
  };

  const generateStudentHistory = (unitId: string) => {
    const currentStudents = getDataByUnit(unitId).alunos;
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    
    return months.map((month, index) => {
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const value = Math.round(currentStudents * (0.85 + (index * 0.03) + variation));
      return { month, value };
    });
  };

  const generateUnitAlerts = (unitId: string, unitData: any, profitMargin: number): UnitAlert[] => {
    const alerts: UnitAlert[] = [];

    // Financial alerts
    if (profitMargin < 15) {
      alerts.push({
        id: `${unitId}-profit-low`,
        type: 'warning',
        category: 'financial',
        title: 'Margem de Lucro Baixa',
        description: `Margem atual: ${profitMargin.toFixed(1)}%. Recomendado: >20%`,
        severity: 'medium',
        createdAt: new Date()
      });
    }

    // Operational alerts
    if (unitData.ocupacao < 30) {
      alerts.push({
        id: `${unitId}-occupancy-low`,
        type: 'danger',
        category: 'operational',
        title: 'Ocupação Crítica',
        description: `Taxa de ocupação: ${unitData.ocupacao}%. Meta: >50%`,
        severity: 'high',
        createdAt: new Date()
      });
    }

    // Strategic alerts
    const strategic = generateStrategicMetrics(unitId);
    if (strategic.customerSatisfaction < 85) {
      alerts.push({
        id: `${unitId}-satisfaction-low`,
        type: 'warning',
        category: 'strategic',
        title: 'Satisfação do Cliente',
        description: `Índice atual: ${strategic.customerSatisfaction}%. Meta: >90%`,
        severity: 'medium',
        createdAt: new Date()
      });
    }

    return alerts;
  };

  const generateComparisons = (data: UnitPerformanceData[]) => {
    const metrics = [
      { key: 'revenue', label: 'Receita', category: 'financial' as const, getValue: (d: UnitPerformanceData) => d.financial.revenue },
      { key: 'profitMargin', label: 'Margem de Lucro', category: 'financial' as const, getValue: (d: UnitPerformanceData) => d.financial.profitMargin },
      { key: 'occupancy', label: 'Taxa de Ocupação', category: 'operational' as const, getValue: (d: UnitPerformanceData) => d.operational.occupancy },
      { key: 'averageTicket', label: 'Ticket Médio', category: 'operational' as const, getValue: (d: UnitPerformanceData) => d.operational.averageTicket },
      { key: 'customerSatisfaction', label: 'Satisfação do Cliente', category: 'strategic' as const, getValue: (d: UnitPerformanceData) => d.strategic.customerSatisfaction }
    ];

    const comparisons: UnitComparison[] = metrics.map(metric => {
      const sortedUnits = [...data]
        .map(unit => ({
          unitId: unit.unitId,
          unitName: unit.unitName,
          value: metric.getValue(unit)
        }))
        .sort((a, b) => b.value - a.value)
        .map((unit, index) => ({
          ...unit,
          rank: index + 1,
          change: (Math.random() - 0.5) * 10 // Random change for demo
        }));

      return {
        metric: metric.label,
        category: metric.category,
        units: sortedUnits
      };
    });

    setComparisons(comparisons);
  };

  const generateRankings = (data: UnitPerformanceData[]) => {
    const rankings: UnitRanking[] = data.map(unit => {
      const financialScore = calculateScore([
        unit.financial.profitMargin,
        unit.financial.revenueGrowth + 50, // Normalize to positive
        (unit.financial.revenue / 150000) * 100 // Normalize revenue
      ]);

      const operationalScore = calculateScore([
        unit.operational.occupancy,
        unit.operational.studentRetention,
        (unit.operational.averageTicket / 500) * 100 // Normalize ticket
      ]);

      const strategicScore = calculateScore([
        unit.strategic.customerSatisfaction,
        unit.strategic.teacherSatisfaction,
        unit.strategic.digitalEngagement,
        unit.strategic.brandAwareness,
        unit.strategic.marketShare * 3 // Boost market share importance
      ]);

      const overallScore = (financialScore + operationalScore + strategicScore) / 3;

      return {
        unitId: unit.unitId,
        unitName: unit.unitName,
        overallScore,
        rank: 0, // Will be set after sorting
        financialScore,
        operationalScore,
        strategicScore,
        trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable'
      };
    });

    // Sort and assign ranks
    rankings.sort((a, b) => b.overallScore - a.overallScore);
    rankings.forEach((ranking, index) => {
      ranking.rank = index + 1;
    });

    setRankings(rankings);
  };

  const calculateScore = (values: number[]): number => {
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.min(100, Math.max(0, avg));
  };

  const getUnitPerformance = (unitId: string): UnitPerformanceData | undefined => {
    return performanceData.find(data => data.unitId === unitId);
  };

  const getUnitComparisons = (category?: 'financial' | 'operational' | 'strategic'): UnitComparison[] => {
    if (!category) return comparisons;
    return comparisons.filter(comp => comp.category === category);
  };

  return {
    performanceData,
    comparisons,
    rankings,
    isLoading,
    getUnitPerformance,
    getUnitComparisons,
    refreshData: generatePerformanceData
  };
};
