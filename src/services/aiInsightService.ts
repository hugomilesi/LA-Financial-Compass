
import { UnitPerformanceData } from '@/types/unitPerformance';

export class AIInsightService {
  private apiKey: string | null = null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || null;
  }

  async generateInsights(performanceData: UnitPerformanceData[], selectedUnit?: string): Promise<any[]> {
    console.log('🤖 [AIInsightService] Generating insights for:', selectedUnit, 'with', performanceData.length, 'units');
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // In a real implementation, this would call an AI service like OpenAI, Claude, etc.
      // For now, we'll generate intelligent mock insights based on the actual data
      return this.generateIntelligentInsights(performanceData, selectedUnit);
    } catch (error) {
      console.error('❌ [AIInsightService] Error:', error);
      throw error;
    }
  }

  private generateIntelligentInsights(performanceData: UnitPerformanceData[], selectedUnit?: string) {
    console.log('📊 [AIInsightService] Analyzing performance data...');
    
    const insights = [];
    const filteredData = selectedUnit === 'all' 
      ? performanceData 
      : performanceData.filter(unit => unit.unitId === selectedUnit);

    // Financial Analysis
    const avgProfitMargin = filteredData.reduce((sum, unit) => sum + unit.financial.profitMargin, 0) / filteredData.length;
    const bestPerformer = filteredData.reduce((best, unit) => 
      unit.financial.profitMargin > best.financial.profitMargin ? unit : best
    );
    const worstPerformer = filteredData.reduce((worst, unit) => 
      unit.financial.profitMargin < worst.financial.profitMargin ? unit : worst
    );

    if (avgProfitMargin < 25) {
      insights.push({
        type: 'financial',
        title: 'Oportunidade de Melhoria da Margem de Lucro',
        content: `A margem de lucro média está em ${avgProfitMargin.toFixed(1)}%, abaixo do benchmark de 25% para o setor. ${bestPerformer.unitName} lidera com ${bestPerformer.financial.profitMargin.toFixed(1)}%, enquanto ${worstPerformer.unitName} precisa de atenção com ${worstPerformer.financial.profitMargin.toFixed(1)}%.`,
        impact: 'high',
        priority: 'important',
        metrics: [
          { label: 'Margem atual', value: `${avgProfitMargin.toFixed(1)}%`, trend: 'down' },
          { label: 'Meta setor', value: '25%', trend: 'up' },
          { label: 'Potencial ganho', value: `R$ ${Math.round((filteredData.reduce((sum, unit) => sum + unit.financial.revenue, 0) * 0.05)).toLocaleString()}`, trend: 'up' }
        ]
      });
    }

    // Occupancy Analysis
    const avgOccupancy = filteredData.reduce((sum, unit) => sum + unit.operational.occupancy, 0) / filteredData.length;
    const lowOccupancyUnits = filteredData.filter(unit => unit.operational.occupancy < 40);
    
    if (lowOccupancyUnits.length > 0) {
      insights.push({
        type: 'operational',
        title: 'Alerta de Baixa Ocupação',
        content: `${lowOccupancyUnits.length} unidade(s) com ocupação crítica abaixo de 40%. ${lowOccupancyUnits.map(u => u.unitName).join(', ')} precisam de estratégias urgentes de captação. A ocupação média está em ${avgOccupancy.toFixed(1)}%.`,
        impact: 'high',
        priority: 'urgent',
        metrics: [
          { label: 'Unidades críticas', value: lowOccupancyUnits.length.toString(), trend: 'down' },
          { label: 'Ocupação média', value: `${avgOccupancy.toFixed(1)}%`, trend: 'down' },
          { label: 'Meta mínima', value: '50%', trend: 'up' }
        ]
      });
    }

    // Comparative Analysis
    if (filteredData.length > 1) {
      const revenueLeader = filteredData.reduce((leader, unit) => 
        unit.financial.revenue > leader.financial.revenue ? unit : leader
      );
      const satisfactionLeader = filteredData.reduce((leader, unit) => 
        unit.strategic.customerSatisfaction > leader.strategic.customerSatisfaction ? unit : leader
      );

      insights.push({
        type: 'comparative',
        title: 'Benchmarking Entre Unidades',
        content: `${revenueLeader.unitName} lidera em receita (R$ ${revenueLeader.financial.revenue.toLocaleString()}), enquanto ${satisfactionLeader.unitName} se destaca em satisfação (${satisfactionLeader.strategic.customerSatisfaction}%). Há oportunidades de cross-learning entre as unidades.`,
        impact: 'medium',
        priority: 'important',
        metrics: [
          { label: 'Gap receita', value: `R$ ${Math.round((revenueLeader.financial.revenue - filteredData.reduce((min, unit) => unit.financial.revenue < min.financial.revenue ? unit : min).financial.revenue)).toLocaleString()}`, trend: 'up' },
          { label: 'Gap satisfação', value: `${Math.round(satisfactionLeader.strategic.customerSatisfaction - filteredData.reduce((min, unit) => unit.strategic.customerSatisfaction < min.strategic.customerSatisfaction ? unit : min).strategic.customerSatisfaction)}%`, trend: 'up' }
        ]
      });
    }

    // Strategic Growth Analysis
    const growthUnits = filteredData.filter(unit => unit.financial.revenueGrowth > 5);
    const avgGrowth = filteredData.reduce((sum, unit) => sum + unit.financial.revenueGrowth, 0) / filteredData.length;

    if (growthUnits.length > 0) {
      insights.push({
        type: 'strategic',
        title: 'Oportunidades de Crescimento',
        content: `${growthUnits.length} unidade(s) apresentam crescimento acima de 5%. O crescimento médio está em ${avgGrowth.toFixed(1)}%. Recomendo analisar as práticas dessas unidades para replicar o sucesso.`,
        impact: 'medium',
        priority: 'monitor',
        metrics: [
          { label: 'Unidades crescendo', value: growthUnits.length.toString(), trend: 'up' },
          { label: 'Crescimento médio', value: `${avgGrowth.toFixed(1)}%`, trend: avgGrowth > 0 ? 'up' : 'down' },
          { label: 'Meta crescimento', value: '8%', trend: 'up' }
        ]
      });
    }

    // Customer Satisfaction Analysis
    const avgSatisfaction = filteredData.reduce((sum, unit) => sum + unit.strategic.customerSatisfaction, 0) / filteredData.length;
    const lowSatisfactionUnits = filteredData.filter(unit => unit.strategic.customerSatisfaction < 85);

    if (lowSatisfactionUnits.length > 0) {
      insights.push({
        type: 'strategic',
        title: 'Atenção à Satisfação do Cliente',
        content: `${lowSatisfactionUnits.length} unidade(s) com satisfação abaixo de 85%. A satisfação média está em ${avgSatisfaction.toFixed(1)}%. Baixa satisfação pode impactar retenção e crescimento orgânico.`,
        impact: 'medium',
        priority: 'important',
        metrics: [
          { label: 'Unidades em risco', value: lowSatisfactionUnits.length.toString(), trend: 'down' },
          { label: 'Satisfação média', value: `${avgSatisfaction.toFixed(1)}%`, trend: avgSatisfaction >= 90 ? 'up' : 'stable' },
          { label: 'Meta satisfação', value: '90%', trend: 'up' }
        ]
      });
    }

    console.log('✅ [AIInsightService] Generated', insights.length, 'intelligent insights');
    return insights;
  }

  async callAIService(prompt: string, data: any): Promise<string> {
    // This would be the actual AI API call
    // For demonstration, we'll return a simulated response
    console.log('🤖 [AIInsightService] AI API call with prompt:', prompt.substring(0, 100) + '...');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return "AI-generated insight based on the provided data...";
  }
}
