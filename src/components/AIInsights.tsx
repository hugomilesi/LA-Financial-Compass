
import { Brain, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Insight {
  id: string;
  type: 'recommendation' | 'alert' | 'opportunity';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  action?: string;
}

const insights: Insight[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Margem Líquida Baixa',
    description: 'Sua margem líquida está 6% abaixo da meta este mês. Considere revisar despesas variáveis.',
    impact: 'high',
    action: 'Reduzir bônus variáveis em 15%'
  },
  {
    id: '2',
    type: 'opportunity',
    title: 'Crescimento de Alunos',
    description: 'Unidade Campo Grande teve crescimento de 12% em matrículas. Considere expandir a equipe.',
    impact: 'medium',
    action: 'Contratar 2 professores adicionais'
  },
  {
    id: '3',
    type: 'recommendation',
    title: 'Otimização de Custos',
    description: 'Pró-labore representa 20% das retiradas. Considere revisar a distribuição.',
    impact: 'medium'
  }
];

export const AIInsights = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return AlertTriangle;
      case 'opportunity': return TrendingUp;
      default: return DollarSign;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'alert': return 'border-l-danger-500 bg-danger-50';
      case 'opportunity': return 'border-l-success-500 bg-success-50';
      default: return 'border-l-primary-500 bg-primary-50';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-bold text-gray-900">Consultor Financeiro Especializado</h2>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight) => {
          const Icon = getIcon(insight.type);
          
          return (
            <div 
              key={insight.id}
              className={`p-4 border-l-4 rounded-r-lg ${getColor(insight.type)}`}
            >
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 mt-0.5 text-gray-700" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                  <p className="text-sm text-gray-700 mt-1">{insight.description}</p>
                  {insight.action && (
                    <div className="mt-2">
                      <span className="text-xs font-medium text-primary-700 bg-primary-100 px-2 py-1 rounded">
                        Ação: {insight.action}
                      </span>
                    </div>
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  insight.impact === 'high' ? 'bg-danger-100 text-danger-700' :
                  insight.impact === 'medium' ? 'bg-warning-100 text-warning-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {insight.impact === 'high' ? 'Alto' : insight.impact === 'medium' ? 'Médio' : 'Baixo'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
