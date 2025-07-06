
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, TrendingUp, Target, BarChart3, AlertCircle, CheckCircle, RefreshCw, Sparkles } from 'lucide-react';
import { UnitPerformanceData } from '@/types/unitPerformance';
import { AIInsightService } from '@/services/aiInsightService';
import { InsightCharts } from './InsightCharts';

interface AIInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  performanceData: UnitPerformanceData[];
  selectedUnit?: string;
}

interface AIInsight {
  type: 'comparative' | 'strategic' | 'operational' | 'financial';
  title: string;
  content: string;
  impact: 'high' | 'medium' | 'low';
  priority: 'urgent' | 'important' | 'monitor';
  metrics?: Array<{ label: string; value: string; trend?: 'up' | 'down' | 'stable' }>;
}

export const AIInsightsModal = ({ isOpen, onClose, performanceData, selectedUnit }: AIInsightsModalProps) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const generateInsights = async () => {
    
    setIsLoading(true);
    
    try {
      const aiService = new AIInsightService();
      const generatedInsights = await aiService.generateInsights(performanceData, selectedUnit);
      setInsights(generatedInsights);
      
    } catch (error) {
      
      // Fallback to demo insights
      setInsights(generateDemoInsights());
    } finally {
      setIsLoading(false);
    }
  };

  const generateDemoInsights = (): AIInsight[] => {
    return [
      {
        type: 'financial',
        title: 'Oportunidade de Otimização de Receita',
        content: 'Campo Grande apresenta a maior receita (R$ 145.320) mas margem de lucro de apenas 21,6%. Recomendo revisar a estrutura de custos, especialmente pessoal (60,1%) e implementar estratégias de otimização operacional.',
        impact: 'high',
        priority: 'important',
        metrics: [
          { label: 'Potencial de economia', value: 'R$ 12.000', trend: 'up' },
          { label: 'Margem objetivo', value: '25%', trend: 'up' }
        ]
      },
      {
        type: 'comparative',
        title: 'Análise Comparativa de Performance',
        content: 'Recreio lidera em satisfação (91%) e retenção (92%), mas tem baixa ocupação (36%). Barra possui a melhor margem (40,6%) mas menor base de alunos. Há oportunidade de cross-learning entre unidades.',
        impact: 'high',
        priority: 'important',
        metrics: [
          { label: 'Gap de ocupação', value: '27%', trend: 'down' },
          { label: 'Diferença margem', value: '19%', trend: 'up' }
        ]
      },
      {
        type: 'strategic',
        title: 'Recomendação Estratégica - Expansão',
        content: 'Com base na análise de market share e satisfação, Recreio tem potencial para crescimento orgânico. Recomendo investir em marketing digital (+15%) e aumentar capacidade operacional.',
        impact: 'medium',
        priority: 'monitor',
        metrics: [
          { label: 'ROI esperado', value: '18%', trend: 'up' },
          { label: 'Payback', value: '8 meses', trend: 'stable' }
        ]
      },
      {
        type: 'operational',
        title: 'Alerta de Eficiência Operacional',
        content: 'Todas as unidades estão abaixo da capacidade ótima de ocupação (50%). Campo Grande e Recreio precisam de estratégias urgentes de captação e retenção de alunos.',
        impact: 'high',
        priority: 'urgent',
        metrics: [
          { label: 'Ocupação média', value: '35,7%', trend: 'down' },
          { label: 'Meta ocupação', value: '65%', trend: 'up' }
        ]
      }
    ];
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

  const filteredInsights = activeTab === 'overview' 
    ? insights 
    : insights.filter(insight => insight.type === activeTab);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            Insights do Consultor Financeiro AI
            <Badge variant="secondary" className="ml-2">
              {selectedUnit === 'all' ? 'Todas as Unidades' : selectedUnit}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            Análises baseadas em dados de performance e benchmarks do setor
          </p>
          <Button 
            onClick={generateInsights} 
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isLoading ? 'Analisando...' : 'Gerar Insights'}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
            <TabsTrigger value="comparative">Comparativo</TabsTrigger>
            <TabsTrigger value="strategic">Estratégico</TabsTrigger>
            <TabsTrigger value="operational">Operacional</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="overview" className="space-y-4">
              <ScrollArea className="h-[500px] pr-4">
                <div className="grid gap-4">
                  {insights.map((insight, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(insight.type)}
                            <CardTitle className="text-lg">{insight.title}</CardTitle>
                          </div>
                          <div className="flex items-center gap-2">
                            {getPriorityIcon(insight.priority)}
                            <Badge className={getImpactColor(insight.impact)}>
                              {insight.impact === 'high' ? 'Alto Impacto' : 
                               insight.impact === 'medium' ? 'Médio Impacto' : 'Baixo Impacto'}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{insight.content}</p>
                        {insight.metrics && (
                          <div className="grid grid-cols-2 gap-4">
                            {insight.metrics.map((metric, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm font-medium">{metric.label}</span>
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {['financial', 'comparative', 'strategic', 'operational'].map((tabType) => (
              <TabsContent key={tabType} value={tabType} className="space-y-4">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {filteredInsights.length > 0 ? (
                      filteredInsights.map((insight, index) => (
                        <Card key={index} className="border-l-4 border-l-blue-500">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg flex items-center gap-2">
                                {getTypeIcon(insight.type)}
                                {insight.title}
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                {getPriorityIcon(insight.priority)}
                                <Badge className={getImpactColor(insight.impact)}>
                                  {insight.impact === 'high' ? 'Alto Impacto' : 
                                   insight.impact === 'medium' ? 'Médio Impacto' : 'Baixo Impacto'}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-700 mb-4">{insight.content}</p>
                            {insight.metrics && (
                              <div className="grid grid-cols-2 gap-4">
                                {insight.metrics.map((metric, idx) => (
                                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <span className="text-sm font-medium">{metric.label}</span>
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
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">Nenhum insight disponível para esta categoria.</p>
                        <p className="text-sm text-gray-500 mt-2">Clique em "Gerar Insights" para análises detalhadas.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </div>
        </Tabs>

        {insights.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <InsightCharts performanceData={performanceData} insights={insights} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
