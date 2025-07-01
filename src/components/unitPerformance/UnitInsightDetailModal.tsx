
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, Target, BarChart3, AlertCircle, CheckCircle, Lightbulb, ArrowRight, X } from 'lucide-react';

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

interface UnitInsightDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  insight: AIInsight | null;
}

export const UnitInsightDetailModal = ({ isOpen, onClose, insight }: UnitInsightDetailModalProps) => {
  if (!insight) return null;

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
      case 'financial': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'comparative': return <BarChart3 className="w-5 h-5 text-blue-600" />;
      case 'strategic': return <Target className="w-5 h-5 text-purple-600" />;
      case 'operational': return <Brain className="w-5 h-5 text-orange-600" />;
      default: return <Brain className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'financial': return 'Financeiro';
      case 'comparative': return 'Comparativo';
      case 'strategic': return 'Estratégico';
      case 'operational': return 'Operacional';
      default: return 'Análise';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getTypeIcon(insight.type)}
              <div>
                <DialogTitle className="text-xl">{insight.title}</DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {getTypeLabel(insight.type)}
                  </Badge>
                  <Badge className={`${getImpactColor(insight.impact)} text-xs border`} variant="secondary">
                    {insight.impact === 'high' ? 'Alto Impacto' : 
                     insight.impact === 'medium' ? 'Médio Impacto' : 'Baixo Impacto'}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {getPriorityIcon(insight.priority)}
                    <span className="text-xs text-gray-600 capitalize">{insight.priority}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Resumo da Análise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{insight.content}</p>
            </CardContent>
          </Card>

          {/* Metrics */}
          {insight.metrics && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Métricas Chave
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {insight.metrics.map((metric, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-sm">{metric.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{metric.value}</span>
                        {metric.trend && (
                          <TrendingUp className={`w-4 h-4 ${
                            metric.trend === 'up' ? 'text-green-600' : 
                            metric.trend === 'down' ? 'text-red-600 rotate-180' : 'text-gray-600'
                          }`} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detailed Analysis */}
          {insight.detailedAnalysis && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Key Findings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    Principais Descobertas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insight.detailedAnalysis.keyFindings.map((finding, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-600" />
                    Recomendações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insight.detailedAnalysis.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-purple-600" />
                    Próximos Passos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insight.detailedAnalysis.nextSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose} variant="outline">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
