import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, DollarSign, Calendar, FileText, Target } from 'lucide-react';
import { useReports, Report } from '@/hooks/useReports';

interface Insight {
  id: string;
  type: 'recommendation' | 'alert' | 'opportunity';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  action?: string;
}

interface InsightDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  insight: Insight;
  onReportClick?: (report: Report) => void;
}

const getDetailedAnalysis = (insightId: string) => {
  switch (insightId) {
    case '1':
      return {
        problemAnalysis: 'A margem líquida atual de 21.9% está 6% abaixo da meta estabelecida de 28%. Isso indica que os custos estão crescendo mais rapidamente que a receita, principalmente devido ao aumento dos bônus variáveis que representam 12% da folha de pagamento.',
        actionSteps: [
          'Revisar política de bônus variáveis para alinhamento com performance',
          'Implementar sistema de metas individuais por unidade',
          'Negociar com fornecedores para reduzir custos fixos em 3%',
          'Otimizar processos operacionais para ganhar eficiência'
        ],
        financialImpact: {
          potentialSavings: 'R$ 15.000/mês',
          marginImprovement: '+2.5%',
          roiTimeline: '3 meses para implementação completa'
        },
        timeline: [
          { phase: 'Análise Detalhada', duration: '1 semana', status: 'completed' },
          { phase: 'Implementação Piloto', duration: '2 semanas', status: 'in-progress' },
          { phase: 'Rollout Completo', duration: '4 semanas', status: 'pending' },
          { phase: 'Monitoramento', duration: 'Contínuo', status: 'pending' }
        ],
        relatedReports: [
          'DRE Detalhado por Unidade',
          'Análise de Custos Variáveis',
          'Relatório de Performance Individual'
        ]
      };
    case '2':
      return {
        problemAnalysis: 'A unidade Campo Grande apresentou crescimento excepcional de 12% em matrículas no último trimestre, superando a capacidade atual da equipe. O ratio aluno/professor está em 1:18, acima do ideal de 1:15.',
        actionSteps: [
          'Contratar 2 professores especializados para Campo Grande',
          'Implementar processo seletivo acelerado (2 semanas)',
          'Criar programa de treinamento intensivo para novos professores',
          'Monitorar satisfação dos alunos durante período de transição'
        ],
        financialImpact: {
          potentialSavings: 'R$ 8.500/mês em receita adicional',
          marginImprovement: '+1.8%',
          roiTimeline: '2 meses para ROI positivo'
        },
        timeline: [
          { phase: 'Aprovação de Budget', duration: '3 dias', status: 'completed' },
          { phase: 'Processo Seletivo', duration: '2 semanas', status: 'in-progress' },
          { phase: 'Contratação e Treinamento', duration: '1 semana', status: 'pending' },
          { phase: 'Implementação', duration: '1 semana', status: 'pending' }
        ],
        relatedReports: [
          'Análise de Capacidade por Unidade',
          'Relatório de Crescimento de Matrículas',
          'ROI de Expansão de Equipe'
        ]
      };
    case '3':
      return {
        problemAnalysis: 'O pró-labore atual representa 20% das retiradas totais, percentual considerado elevado para o porte da empresa. A análise de benchmark indica que o ideal seria entre 12-15% para empresas similares.',
        actionSteps: [
          'Revisar estrutura de retiradas dos sócios',
          'Implementar política de distribuição de lucros mais equilibrada',
          'Criar reserva de capital de giro para períodos de baixa',
          'Estabelecer teto para pró-labore baseado no faturamento'
        ],
        financialImpact: {
          potentialSavings: 'R$ 12.000/mês',
          marginImprovement: '+2.1%',
          roiTimeline: 'Impacto imediato na geração de caixa'
        },
        timeline: [
          { phase: 'Análise Jurídica', duration: '1 semana', status: 'pending' },
          { phase: 'Aprovação dos Sócios', duration: '1 semana', status: 'pending' },
          { phase: 'Implementação', duration: '1 semana', status: 'pending' },
          { phase: 'Monitoramento', duration: 'Contínuo', status: 'pending' }
        ],
        relatedReports: [
          'Análise de Distribuição de Lucros',
          'Benchmark Setorial',
          'Projeção de Fluxo de Caixa'
        ]
      };
    default:
      return {
        problemAnalysis: 'Análise detalhada não disponível.',
        actionSteps: [],
        financialImpact: {
          potentialSavings: 'N/A',
          marginImprovement: 'N/A',
          roiTimeline: 'N/A'
        },
        timeline: [],
        relatedReports: []
      };
  }
};

const getIcon = (type: string) => {
  switch (type) {
    case 'alert': return AlertTriangle;
    case 'opportunity': return TrendingUp;
    default: return DollarSign;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'alert': return 'text-danger-600 bg-danger-50';
    case 'opportunity': return 'text-success-600 bg-success-50';
    default: return 'text-primary-600 bg-primary-50';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-success-500';
    case 'in-progress': return 'bg-warning-500';
    default: return 'bg-gray-300';
  }
};

export const InsightDetailModal = ({ isOpen, onClose, insight, onReportClick }: InsightDetailModalProps) => {
  const Icon = getIcon(insight.type);
  const analysis = getDetailedAnalysis(insight.id);
  const { getRelatedReports } = useReports();

  const relatedReports = getRelatedReports('margem-liquida');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="w-6 h-6 text-primary-600" />
            {insight.title} - Análise Detalhada
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Insight Summary */}
          <Card className="p-6">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${getTypeColor(insight.type)}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{insight.title}</h3>
                <p className="text-gray-700 mb-3">{insight.description}</p>
                <div className="flex items-center gap-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    insight.impact === 'high' ? 'bg-danger-100 text-danger-700' :
                    insight.impact === 'medium' ? 'bg-warning-100 text-warning-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    Impacto: {insight.impact === 'high' ? 'Alto' : insight.impact === 'medium' ? 'Médio' : 'Baixo'}
                  </span>
                  {insight.action && (
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                      {insight.action}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Problem Analysis */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-600" />
              Análise do Problema/Oportunidade
            </h3>
            <p className="text-gray-700 leading-relaxed">{analysis.problemAnalysis}</p>
          </Card>

          {/* Action Steps & Financial Impact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-success-600" />
                Plano de Ação
              </h3>
              <ul className="space-y-3">
                {analysis.actionSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="bg-primary-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-success-600" />
                Impacto Financeiro
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Economia Potencial:</span>
                  <span className="font-semibold text-success-600">{analysis.financialImpact.potentialSavings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Melhoria na Margem:</span>
                  <span className="font-semibold text-success-600">{analysis.financialImpact.marginImprovement}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Timeline ROI:</span>
                  <span className="font-semibold text-primary-600">{analysis.financialImpact.roiTimeline}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Timeline */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              Cronograma de Implementação
            </h3>
            <div className="space-y-4">
              {analysis.timeline.map((phase, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(phase.status)}`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{phase.phase}</span>
                      <span className="text-sm text-gray-600">{phase.duration}</span>
                    </div>
                    <div className="text-xs text-gray-500 capitalize">{phase.status.replace('-', ' ')}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Related Reports */}
          {onReportClick && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Relatórios Relacionados</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {relatedReports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => onReportClick(report)}
                    className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-primary-600 mb-1" />
                    <p className="text-sm font-medium text-gray-900">{report.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{report.period}</p>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
