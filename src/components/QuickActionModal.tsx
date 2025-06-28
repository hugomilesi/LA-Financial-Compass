
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, Target, FileText, Building2, TrendingUp } from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'export-dre' | 'set-goals' | 'view-reports' | 'unit-analysis' | null;
}

const unitAnalysisData = [
  { unit: 'Campo Grande', receita: 98500, despesa: 76800, lucro: 21700 },
  { unit: 'Recreio', receita: 87200, despesa: 68500, lucro: 18700 },
  { unit: 'Barra', receita: 60080, despesa: 46700, lucro: 13380 }
];

const goalsData = [
  { meta: 'Receita Total', atual: 245780, objetivo: 260000, progresso: 94.5 },
  { meta: 'Alunos Ativos', atual: 1247, objetivo: 1300, progresso: 95.9 },
  { meta: 'Ticket Médio', atual: 197, objetivo: 200, progresso: 98.5 },
  { meta: 'Margem Líquida', atual: 21.8, objetivo: 25.0, progresso: 87.2 }
];

const reportsData = [
  { mes: 'Jan', dre: 40000, fluxo: 35000 },
  { mes: 'Fev', dre: 50000, fluxo: 48000 },
  { mes: 'Mar', dre: 55000, fluxo: 52000 },
  { mes: 'Abr', dre: 50000, fluxo: 47000 },
  { mes: 'Mai', dre: 65000, fluxo: 61000 },
  { mes: 'Jun', dre: 53780, fluxo: 51000 }
];

export const QuickActionModal = ({ isOpen, onClose, actionType }: QuickActionModalProps) => {
  if (!actionType) return null;

  const getModalContent = () => {
    switch (actionType) {
      case 'export-dre':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Download className="w-5 h-5" />
                Exportar Demonstrativo de Resultado (DRE)
              </h4>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-2">Período</h5>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="period" defaultChecked />
                      <span>Junho 2024</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="period" />
                      <span>Maio 2024</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="period" />
                      <span>1º Semestre 2024</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium mb-2">Formato</h5>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="format" defaultChecked />
                      <span>PDF Detalhado</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="format" />
                      <span>Excel (XLSX)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="format" />
                      <span>CSV</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h5 className="font-medium mb-2">Unidades</h5>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span>Todas as Unidades</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>Campo Grande</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>Recreio</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>Barra</span>
                  </label>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h5 className="font-medium mb-2">Preview do DRE - Junho 2024</h5>
              <div className="text-sm space-y-1 bg-gray-50 p-4 rounded">
                <div className="flex justify-between font-semibold border-b pb-1">
                  <span>RECEITAS</span>
                  <span>R$ 245.780</span>
                </div>
                <div className="flex justify-between pl-4">
                  <span>Mensalidades</span>
                  <span>R$ 195.624</span>
                </div>
                <div className="flex justify-between pl-4">
                  <span>Matrículas</span>
                  <span>R$ 32.456</span>
                </div>
                <div className="flex justify-between pl-4">
                  <span>Outras Receitas</span>
                  <span>R$ 17.700</span>
                </div>
                
                <div className="flex justify-between font-semibold border-b pb-1 pt-2">
                  <span>DESPESAS</span>
                  <span>R$ 192.000</span>
                </div>
                <div className="flex justify-between pl-4">
                  <span>Pessoal</span>
                  <span>R$ 112.000</span>
                </div>
                <div className="flex justify-between pl-4">
                  <span>Aluguel</span>
                  <span>R$ 35.000</span>
                </div>
                <div className="flex justify-between pl-4">
                  <span>Marketing</span>
                  <span>R$ 24.000</span>
                </div>
                <div className="flex justify-between pl-4">
                  <span>Outras Despesas</span>
                  <span>R$ 21.000</span>
                </div>
                
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>LUCRO LÍQUIDO</span>
                  <span className="text-green-600">R$ 53.780</span>
                </div>
              </div>
            </Card>

            <div className="flex gap-2">
              <Button className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Exportar DRE
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </div>
        );

      case 'set-goals':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Definir e Acompanhar Metas
              </h4>
              
              <div className="space-y-4">
                {goalsData.map((goal, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium">{goal.meta}</h5>
                      <span className={`text-sm font-medium ${goal.progresso >= 95 ? 'text-green-600' : goal.progresso >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {goal.progresso}%
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Atual: {goal.atual.toLocaleString()}</span>
                          <span>Meta: {goal.objetivo.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${goal.progresso >= 95 ? 'bg-green-500' : goal.progresso >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(goal.progresso, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Editar</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h5 className="font-medium mb-4">Adicionar Nova Meta</h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo de Meta</label>
                  <select className="w-full border rounded px-3 py-2">
                    <option>Receita</option>
                    <option>Despesa</option>
                    <option>Alunos</option>
                    <option>Ticket Médio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Valor</label>
                  <input type="number" className="w-full border rounded px-3 py-2" placeholder="0" />
                </div>
              </div>
              <Button className="w-full mt-4">Adicionar Meta</Button>
            </Card>
          </div>
        );

      case 'view-reports':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Relatórios Gerenciais
              </h4>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-3">Relatórios Disponíveis</h5>
                  <div className="space-y-2">
                    {[
                      'DRE Mensal',
                      'Fluxo de Caixa',
                      'Inadimplência',
                      'Análise de Alunos',
                      'Rentabilidade por Unidade',
                      'Comparativo Anual'
                    ].map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{report}</span>
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3 mr-1" />
                          Baixar
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium mb-3">Evolução dos Resultados</h5>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={reportsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`R$ ${(value as number).toLocaleString()}`, '']} />
                      <Line dataKey="dre" stroke="#10B981" name="DRE" strokeWidth={2} />
                      <Line dataKey="fluxo" stroke="#3B82F6" name="Fluxo" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">6</div>
                <div className="text-sm text-gray-600">Relatórios Mensais</div>
              </Card>
              <Card className="p-4 text-center">
                <FileText className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">24</div>
                <div className="text-sm text-gray-600">Análises Personalizadas</div>
              </Card>
              <Card className="p-4 text-center">
                <Download className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">156</div>
                <div className="text-sm text-gray-600">Downloads Este Mês</div>
              </Card>
            </div>
          </div>
        );

      case 'unit-analysis':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Análise Comparativa por Unidades
              </h4>
              
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={unitAnalysisData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="unit" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${(value as number).toLocaleString()}`, '']} />
                  <Bar dataKey="receita" fill="#10B981" name="Receita" />
                  <Bar dataKey="despesa" fill="#EF4444" name="Despesa" />
                  <Bar dataKey="lucro" fill="#3B82F6" name="Lucro" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              {unitAnalysisData.map((unit, index) => (
                <Card key={index} className="p-4">
                  <h5 className="font-semibold mb-3">{unit.unit}</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Receita:</span>
                      <span className="font-medium">R$ {unit.receita.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Despesa:</span>
                      <span className="font-medium">R$ {unit.despesa.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>Lucro:</span>
                      <span className="font-bold text-green-600">R$ {unit.lucro.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Margem: {((unit.lucro / unit.receita) * 100).toFixed(1)}%
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-4">
              <h5 className="font-medium mb-3">Indicadores por Unidade</h5>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Unidade</th>
                      <th className="text-right py-2">Alunos</th>
                      <th className="text-right py-2">Ticket Médio</th>
                      <th className="text-right py-2">Inadimplência</th>
                      <th className="text-right py-2">ROI Marketing</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">Campo Grande</td>
                      <td className="text-right">498</td>
                      <td className="text-right">R$ 198</td>
                      <td className="text-right">3.2%</td>
                      <td className="text-right">4.1x</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Recreio</td>
                      <td className="text-right">441</td>
                      <td className="text-right">R$ 197</td>
                      <td className="text-right">2.8%</td>
                      <td className="text-right">3.8x</td>
                    </tr>
                    <tr>
                      <td className="py-2">Barra</td>
                      <td className="text-right">308</td>
                      <td className="text-right">R$ 195</td>
                      <td className="text-right">4.1%</td>
                      <td className="text-right">3.2x</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (actionType) {
      case 'export-dre':
        return 'Exportar DRE';
      case 'set-goals':
        return 'Definir Metas';
      case 'view-reports':
        return 'Ver Relatórios';
      case 'unit-analysis':
        return 'Análise Unidades';
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getModalTitle()}</DialogTitle>
        </DialogHeader>
        {getModalContent()}
      </DialogContent>
    </Dialog>
  );
};
