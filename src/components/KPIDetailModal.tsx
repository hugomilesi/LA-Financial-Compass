import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { LucideIcon, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useReports, Report } from '@/hooks/useReports';

interface KPIDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpi: {
    title: string;
    value: string;
    change?: number;
    target?: number;
    icon: LucideIcon;
    alert?: 'success' | 'warning' | 'danger';
    subtitle?: string;
  };
  onReportClick?: (report: Report) => void;
}

const getHistoricalData = (title: string) => {
  switch (title) {
    case 'Receita Total':
      return [
        { month: 'Jan', value: 220000 },
        { month: 'Fev', value: 235000 },
        { month: 'Mar', value: 245000 },
        { month: 'Abr', value: 238000 },
        { month: 'Mai', value: 260000 },
        { month: 'Jun', value: 245780 }
      ];
    case 'Despesa Total':
      return [
        { month: 'Jan', value: 180000 },
        { month: 'Fev', value: 185000 },
        { month: 'Mar', value: 190000 },
        { month: 'Abr', value: 188000 },
        { month: 'Mai', value: 195000 },
        { month: 'Jun', value: 192000 }
      ];
    case 'Geração de Caixa':
      return [
        { month: 'Jan', value: 40000 },
        { month: 'Fev', value: 50000 },
        { month: 'Mar', value: 55000 },
        { month: 'Abr', value: 50000 },
        { month: 'Mai', value: 65000 },
        { month: 'Jun', value: 53780 }
      ];
    case 'Margem Líquida':
      return [
        { month: 'Jan', value: 18.2 },
        { month: 'Fev', value: 21.3 },
        { month: 'Mar', value: 22.4 },
        { month: 'Abr', value: 21.0 },
        { month: 'Mai', value: 25.0 },
        { month: 'Jun', value: 21.9 }
      ];
    case 'Ticket Médio':
      return [
        { month: 'Jan', value: 176 },
        { month: 'Fev', value: 187 },
        { month: 'Mar', value: 192 },
        { month: 'Abr', value: 184 },
        { month: 'Mai', value: 195 },
        { month: 'Jun', value: 197 }
      ];
    case 'Custo por Aluno':
      return [
        { month: 'Jan', value: 268 },
        { month: 'Fev', value: 275 },
        { month: 'Mar', value: 280 },
        { month: 'Abr', value: 278 },
        { month: 'Mai', value: 282 },
        { month: 'Jun', value: 285 }
      ];
    case 'Inadimplência (%)':
      return [
        { month: 'Jan', value: 5.2 },
        { month: 'Fev', value: 4.8 },
        { month: 'Mar', value: 4.5 },
        { month: 'Abr', value: 4.7 },
        { month: 'Mai', value: 4.3 },
        { month: 'Jun', value: 4.4 }
      ];
    default:
      return [];
  }
};

const getAnalysis = (title: string) => {
  switch (title) {
    case 'Receita Total':
      return {
        trend: 'Crescimento consistente com leve queda em junho',
        analysis: 'A receita manteve trajetória ascendente nos primeiros 5 meses, com pequena redução em junho devido à sazonalidade típica do período.',
        recommendations: [
          'Implementar estratégias de retenção para o período de inverno',
          'Diversificar ofertas para compensar sazonalidade',
          'Focar em campanhas de marketing direcionadas'
        ]
      };
    case 'Despesa Total':
      return {
        trend: 'Crescimento controlado das despesas',
        analysis: 'As despesas cresceram de forma moderada, mantendo-se abaixo do crescimento da receita na maioria dos meses.',
        recommendations: [
          'Revisar custos variáveis mensalmente',
          'Implementar sistema de orçamento por centro de custo',
          'Negociar contratos de fornecedores principais'
        ]
      };
    case 'Geração de Caixa':
      return {
        trend: 'Volatilidade na geração de caixa com pico em maio',
        analysis: 'A geração de caixa apresentou variações significativas, com melhor performance em maio devido a campanhas promocionais.',
        recommendations: [
          'Estabelecer metas mensais de geração de caixa',
          'Criar reserva de emergência para meses de baixa geração',
          'Implementar fluxo de caixa projetado para 90 dias'
        ]
      };
    case 'Margem Líquida':
      return {
        trend: 'Margem oscilante com tendência de melhora',
        analysis: 'A margem líquida mostrou melhora consistente até maio, com leve queda em junho que ainda mantém patamar saudável.',
        recommendations: [
          'Focar em produtos/serviços de maior margem',
          'Revisar política de preços trimestralmente',
          'Otimizar processo operacional para reduzir custos'
        ]
      };
    case 'Ticket Médio':
      return {
        trend: 'Crescimento constante do ticket médio',
        analysis: 'O ticket médio apresentou crescimento consistente, indicando sucesso nas estratégias de upselling e cross-selling.',
        recommendations: [
          'Expandir programa de fidelidade',
          'Treinar equipe em técnicas de vendas consultivas',
          'Criar pacotes premium para aumentar ainda mais o ticket'
        ]
      };
    case 'Custo por Aluno':
      return {
        trend: 'Tendência gradual de aumento no custo por aluno',
        analysis: 'O custo por aluno apresentou crescimento constante ao longo dos meses, indicando necessidade de otimização de processos e revisão de gastos operacionais para manter a eficiência.',
        recommendations: [
          'Revisar estrutura de custos variáveis por aluno',
          'Implementar programa de eficiência operacional',
          'Analisar possibilidades de automação de processos',
          'Negociar melhores condições com fornecedores'
        ]
      };
    case 'Inadimplência (%)':
      return {
        trend: 'Redução consistente da inadimplência com leve alta em junho',
        analysis: 'A taxa de inadimplência apresentou tendência de queda nos primeiros meses, com pequeno aumento em junho ainda dentro dos padrões aceitáveis. O controle rigoroso das cobranças tem se mostrado eficaz.',
        recommendations: [
          'Implementar sistema de cobrança automatizada',
          'Criar programa de renegociação para inadimplentes',
          'Estabelecer política de desconto para pagamento antecipado',
          'Monitorar indicadores de inadimplência por unidade semanalmente'
        ]
      };
    default:
      return {
        trend: 'Análise não disponível',
        analysis: 'Dados insuficientes para análise detalhada.',
        recommendations: []
      };
  }
};

export const KPIDetailModal = ({ isOpen, onClose, kpi, onReportClick }: KPIDetailModalProps) => {
  const Icon = kpi.icon;
  const historicalData = getHistoricalData(kpi.title);
  const analysis = getAnalysis(kpi.title);
  const { getRelatedReports } = useReports();

  const getContextKey = (title: string) => {
    switch (title) {
      case 'Receita Total': return 'receita-total';
      case 'Despesa Total': return 'despesa-total';
      case 'Geração de Caixa': return 'geracao-caixa';
      case 'Margem Líquida': return 'margem-liquida';
      case 'Ticket Médio': return 'ticket-medio';
      case 'Custo por Aluno': return 'custo-aluno';
      case 'Inadimplência (%)': return 'inadimplencia';
      default: return 'receita-total';
    }
  };

  const relatedReports = getRelatedReports(getContextKey(kpi.title));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="w-6 h-6 text-primary-600" />
            {kpi.title} - Análise Detalhada
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Value */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Atual</p>
                <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                {kpi.subtitle && (
                  <p className={`text-sm font-medium mt-1 ${
                    kpi.alert === 'success' ? 'text-success-600' :
                    kpi.alert === 'warning' ? 'text-warning-600' : 'text-danger-600'
                  }`}>
                    {kpi.subtitle}
                  </p>
                )}
              </div>
              {kpi.change !== undefined && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Variação</p>
                  <p className={`text-xl font-semibold ${
                    // Special handling for cost-based metrics and delinquency - negative change is good (green)
                    kpi.title === 'Custo por Aluno' || kpi.title === 'Despesa Total' || kpi.title === 'Inadimplência (%)'
                      ? kpi.change < 0 ? 'text-success-600' : 'text-danger-600'
                      : kpi.change > 0 ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    {kpi.change > 0 ? '+' : ''}{kpi.change.toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Historical Chart */}
          {historicalData.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Evolução Histórica</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [
                      kpi.title.includes('Margem') || kpi.title.includes('%') 
                        ? `${value}%` 
                        : `R$ ${(value as number).toLocaleString()}`, 
                      kpi.title
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3 text-primary-700">Tendência</h3>
              <p className="text-gray-700">{analysis.trend}</p>
              
              <h3 className="text-lg font-semibold mb-3 mt-4 text-primary-700">Análise</h3>
              <p className="text-gray-700">{analysis.analysis}</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3 text-success-700">Recomendações</h3>
              <ul className="space-y-2">
                {analysis.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-success-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Target Progress */}
          {kpi.target && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">
                {kpi.title === 'Inadimplência (%)' ? 'Meta de Controle' : 'Progresso da Meta'}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    {kpi.title === 'Inadimplência (%)' ? 'Meta máxima: ' : 'Meta: '}
                    {kpi.target}%
                  </span>
                  <span>Atual: {kpi.value}</span>
                </div>
                {kpi.title === 'Inadimplência (%)' ? (
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${
                        parseFloat(kpi.value) <= kpi.target ? 'bg-success-500' : 
                        parseFloat(kpi.value) <= 5.0 ? 'bg-warning-500' : 'bg-danger-500'
                      }`}
                      style={{ 
                        width: `${Math.min(100, (parseFloat(kpi.value) / 8) * 100)}%` 
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-primary-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(kpi.target || 0, 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </Card>
          )}

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
