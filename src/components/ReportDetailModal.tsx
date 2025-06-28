
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Calendar, TrendingUp, Loader2, Users, DollarSign } from 'lucide-react';
import { Report, useReports } from '@/hooks/useReports';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report | null;
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const getStatusColor = (status: Report['status']) => {
  switch (status) {
    case 'available': return 'text-green-600';
    case 'generating': return 'text-yellow-600';
    case 'error': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

const getStatusText = (status: Report['status']) => {
  switch (status) {
    case 'available': return 'Disponível';
    case 'generating': return 'Gerando...';
    case 'error': return 'Erro';
    default: return 'Desconhecido';
  }
};

export const ReportDetailModal = ({ isOpen, onClose, report }: ReportDetailModalProps) => {
  const { downloadReport, isLoading } = useReports();

  if (!report) return null;

  const handleDownload = () => {
    downloadReport(report.id);
  };

  const renderReportData = () => {
    if (!report.data) return null;

    switch (report.type) {
      case 'dre':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">R$ {report.data.totalReceita.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Receita Total</div>
              </Card>
              <Card className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-red-600" />
                <div className="text-2xl font-bold">R$ {report.data.totalDespesa.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Despesa Total</div>
              </Card>
              <Card className="p-4 text-center">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">R$ {report.data.lucroLiquido.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Lucro Líquido</div>
              </Card>
            </div>

            <Card className="p-4">
              <h4 className="font-semibold mb-4">Resultado por Unidade</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={report.data.unidades}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${(value as number).toLocaleString()}`, '']} />
                  <Bar dataKey="receita" fill="#10B981" name="Receita" />
                  <Bar dataKey="despesa" fill="#EF4444" name="Despesa" />
                  <Bar dataKey="lucro" fill="#3B82F6" name="Lucro" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        );

      case 'custos':
        return (
          <div className="space-y-4">
            <Card className="p-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Custos Variáveis Totais</h4>
                  <div className="text-3xl font-bold text-red-600">
                    R$ {report.data.custosVariaveis.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {report.data.percentualReceita}% da receita total
                  </div>
                </div>
                <div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={report.data.principais}
                        dataKey="valor"
                        nameKey="categoria"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ categoria, percentual }) => `${categoria}: ${percentual}%`}
                      >
                        {report.data.principais.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={['#EF4444', '#F97316', '#EAB308', '#84CC16'][index % 4]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              {report.data.principais.map((item: any, index: number) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{item.categoria}</h4>
                      <p className="text-sm text-gray-600">{item.percentual}% do total</p>
                    </div>
                    <div className="text-xl font-bold">R$ {item.valor.toLocaleString()}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'kpi':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{report.data.totalColaboradores}</div>
                <div className="text-sm text-gray-600">Total de Colaboradores</div>
              </Card>
              <Card className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">{report.data.performanceMedia}%</div>
                <div className="text-sm text-gray-600">Performance Média</div>
              </Card>
            </div>

            <Card className="p-4">
              <h4 className="font-semibold mb-4">Top Performers</h4>
              <div className="space-y-3">
                {report.data.topPerformers.map((performer: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{performer.nome}</div>
                      <div className="text-sm text-gray-600">{performer.unidade}</div>
                    </div>
                    <div className="text-lg font-bold text-green-600">{performer.score}%</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case 'rentabilidade':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{report.data.ocupacaoAtual}</div>
                <div className="text-sm text-gray-600">Alunos Ativos</div>
              </Card>
              <Card className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">{report.data.percentualOcupacao}%</div>
                <div className="text-sm text-gray-600">Taxa de Ocupação</div>
              </Card>
            </div>

            <Card className="p-4">
              <h4 className="font-semibold mb-4">Ocupação por Unidade</h4>
              <div className="space-y-3">
                {report.data.unidades.map((unidade: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{unidade.nome}</span>
                      <span>{unidade.ocupacao}/{unidade.capacidade} ({unidade.percentual}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${unidade.percentual}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case 'benchmark':
        return (
          <div className="space-y-4">
            <Card className="p-4">
              <div className="text-center mb-4">
                <h4 className="text-2xl font-bold text-green-600">{report.data.posicaoMercado}</h4>
                <p className="text-gray-600">Posição no Mercado</p>
              </div>
            </Card>

            <div className="space-y-3">
              {report.data.indicadores.map((indicador: any, index: number) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{indicador.metrica}</h4>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>Nossa empresa: {indicador.empresa}</span>
                        <span>Setor: {indicador.setor}</span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      indicador.posicao === 'superior' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {indicador.posicao === 'superior' ? 'Superior' : 'Inferior'}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <Card className="p-6 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Dados do relatório não disponíveis para visualização</p>
          </Card>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary-600" />
            {report.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Info */}
          <Card className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Período</p>
                <p className="font-medium">{report.period}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className={`font-medium ${getStatusColor(report.status)}`}>
                  {getStatusText(report.status)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Última Atualização</p>
                <p className="font-medium">{formatDate(report.lastUpdated)}</p>
              </div>
              {report.fileSize && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tamanho</p>
                  <p className="font-medium">{report.fileSize}</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-1">Descrição</p>
              <p className="text-gray-800">{report.description}</p>
            </div>
          </Card>

          {/* Report Data Visualization */}
          {renderReportData()}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              onClick={handleDownload}
              disabled={isLoading || report.status !== 'available'}
              className="flex-1"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Baixando...' : 'Baixar Relatório'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
