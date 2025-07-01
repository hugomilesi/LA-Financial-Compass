
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Target, BarChart3, AlertCircle, CheckCircle, RefreshCw, Sparkles, ChevronRight } from 'lucide-react';
import { UnitPerformanceData } from '@/types/unitPerformance';
import { AIInsightService } from '@/services/aiInsightService';
import { UnitInsightDetailModal } from './UnitInsightDetailModal';

interface UnitAIInsightsProps {
  performanceData: UnitPerformanceData[];
  selectedUnit: string;
}

interface AIInsight {
  type: 'comparative' | 'strategic' | 'operational' | 'financial';
  title: string;
  content: string;
  impact: 'high' | 'medium' | 'low';
  priority: 'urgent' | 'important' | 'monitor';
  metrics?: Array<{ label: string; value: string; trend?: 'up' | 'down' | 'stable' }>;
  detailedAnalysis?: {
    recommendations: string[];
    keyFindings: string[];
    nextSteps: string[];
  };
}

export const UnitAIInsights = ({ performanceData, selectedUnit }: UnitAIInsightsProps) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (performanceData.length > 0) {
      generateInsights();
    }
  }, [performanceData, selectedUnit]);

  const generateInsights = async () => {
    console.log('🧠 [UnitAIInsights] Generating AI insights...');
    setIsLoading(true);
    
    try {
      const aiService = new AIInsightService();
      const generatedInsights = await aiService.generateInsights(performanceData, selectedUnit);
      setInsights(generatedInsights);
      console.log('✅ [UnitAIInsights] Generated insights:', generatedInsights.length);
    } catch (error) {
      console.error('❌ [UnitAIInsights] Error generating insights:', error);
      setInsights([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsightClick = (insight: AIInsight) => {
    setSelectedInsight(insight);
    setIsModalOpen(true);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'important': return <Target className="w-4 h-4 text-orange-600" />;
      case 'monitor': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <Brain className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'financial': return <TrendingUp className="w-4 h-4" />;
      case 'comparative': return <BarChart3 className="w-4 h-4" />;
      case 'strategic': return <Target className="w-4 h-4" />;
      case 'operational': return <Brain className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  // Show top 3 most important insights
  const topInsights = insights
    .sort((a, b) => {
      const priorityOrder = { urgent: 3, important: 2, monitor: 1 };
      const impactOrder = { high: 3, medium: 2, low: 1 };
      
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
      const aImpact = impactOrder[a.impact as keyof typeof impactOrder] || 0;
      const bImpact = impactOrder[b.impact as keyof typeof impactOrder] || 0;
      
      return (bPriority + bImpact) - (aPriority + aImpact);
    })
    .slice(0, 3);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Insights do Consultor Financeiro AI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Analisando dados de performance...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Insights do Consultor Financeiro AI
            </CardTitle>
            <Button 
              onClick={generateInsights} 
              size="sm"
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Gerar Insights
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Nenhum insight disponível.</p>
            <p className="text-sm text-gray-500 mt-2">Clique em "Gerar Insights" para análises detalhadas.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Insights do Consultor Financeiro AI
              <Badge variant="secondary" className="ml-2">
                {selectedUnit === 'all' ? 'Todas as Unidades' : selectedUnit}
              </Badge>
            </CardTitle>
            <Button 
              onClick={generateInsights} 
              size="sm"
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topInsights.map((insight, index) => (
              <Card 
                key={index} 
                className="border-l-4 border-l-purple-500 cursor-pointer hover:shadow-md transition-shadow group"
                onClick={() => handleInsightClick(insight)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(insight.type)}
                      <CardTitle className="text-base">{insight.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(insight.priority)}
                      <Badge className={getImpactColor(insight.impact)} variant="secondary">
                        {insight.impact === 'high' ? 'Alto Impacto' : 
                         insight.impact === 'medium' ? 'Médio Impacto' : 'Baixo Impacto'}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm mb-3">{insight.content}</p>
                  {insight.metrics && (
                    <div className="grid grid-cols-3 gap-3">
                      {insight.metrics.map((metric, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                          <span className="font-medium">{metric.label}</span>
                          <div className="flex items-center gap-1">
                            <span className="font-bold">{metric.value}</span>
                            {metric.trend && (
                              <TrendingUp className={`w-3 h-3 ${
                                metric.trend === 'up' ? 'text-green-600' : 
                                metric.trend === 'down' ? 'text-red-600 rotate-180' : 'text-gray-600'
                              }`} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Clique para ver análise detalhada
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {insights.length > 3 && (
              <div className="text-center pt-2">
                <p className="text-sm text-gray-500">
                  Mostrando {topInsights.length} de {insights.length} insights prioritários
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <UnitInsightDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        insight={selectedInsight}
      />
    </>
  );
};
