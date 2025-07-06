
import { UnitPerformanceData } from '@/types/unitPerformance';

export class AIInsightService {
  private apiKey: string | null = null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || null;
  }

  async generateInsights(performanceData: UnitPerformanceData[], selectedUnit?: string): Promise<any[]> {
    
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // In a real implementation, this would call an AI service like OpenAI, Claude, etc.
      // For now, we'll generate intelligent mock insights based on the actual data
      return this.generateIntelligentInsights(performanceData, selectedUnit);
    } catch (error) {
      
      throw error;
    }
  }

  private generateIntelligentInsights(performanceData: UnitPerformanceData[], selectedUnit?: string) {
    
    
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
        ],
        detailedAnalysis: {
          recommendations: [
            'Revisar estrutura de custos das unidades com menor margem',
            'Implementar benchmarking de melhores práticas entre unidades',
            'Analisar oportunidades de otimização operacional',
            'Considerar ajustes na precificação dos serviços'
          ],
          keyFindings: [
            `Diferença de ${(bestPerformer.financial.profitMargin - worstPerformer.financial.profitMargin).toFixed(1)}% entre melhor e pior unidade`,
            'Potencial de padronização de processos eficientes',
            'Necessidade de revisão da estrutura de custos'
          ],
          nextSteps: [
            'Auditoria detalhada das unidades com baixa margem',
            'Implementação de KPIs de controle de custos',
            'Treinamento em gestão financeira para gerentes'
          ]
        }
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
        ],
        detailedAnalysis: {
          recommendations: [
            'Criar programa de troca de melhores práticas entre unidades',
            'Implementar sistema de mentoria entre gerentes',
            'Padronizar processos das unidades de melhor performance'
          ],
          keyFindings: [
            'Variação significativa de performance entre unidades',
            'Oportunidades claras de aprendizado cruzado',
            'Necessidade de padronização de processos'
          ],
          nextSteps: [
            'Workshop de compartilhamento de práticas',
            'Criação de manual de melhores práticas',
            'Sistema de acompanhamento de melhorias'
          ]
        }
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
        ],
        detailedAnalysis: {
          recommendations: [
            'Identificar fatores de sucesso das unidades em crescimento',
            'Replicar estratégias eficazes nas demais unidades',
            'Investir em marketing digital e captação de alunos'
          ],
          keyFindings: [
            'Algumas unidades demonstram forte potencial de crescimento',
            'Estratégias de captação estão funcionando em unidades específicas',
            'Oportunidade de acelerar crescimento nas demais unidades'
          ],
          nextSteps: [
            'Análise detalhada das estratégias de crescimento',
            'Plano de expansão para unidades estagnadas',
            'Aumento de investimento em marketing'
          ]
        }
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
        ],
        detailedAnalysis: {
          recommendations: [
            'Implementar pesquisas de satisfação mais frequentes',
            'Melhorar treinamento da equipe de atendimento',
            'Investir em infraestrutura e recursos pedagógicos'
          ],
          keyFindings: [
            'Correlação entre satisfação e retenção de alunos',
            'Necessidade de melhoria no atendimento ao cliente',
            'Oportunidade de diferenciação competitiva'
          ],
          nextSteps: [
            'Programa de melhoria da experiência do cliente',
            'Treinamento intensivo da equipe',
            'Monitoramento contínuo da satisfação'
          ]
        }
      });
    }

    
    return insights;
  }

  async callAIService(prompt: string, data: any): Promise<string> {
    // This would be the actual AI API call
    // For demonstration, we'll return a simulated response
    
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return "AI-generated insight based on the provided data...";
  }
}
