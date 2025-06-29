import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, Target, FileText, Building2, TrendingUp, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useQuickActions, ExportConfig } from '@/hooks/useQuickActions';
import { monthlyData, costCenterData, getDREData, getConsolidatedDREData } from '@/utils/dashboardData';
import { useReports, Report } from '@/hooks/useReports';
import { useUnit } from '@/contexts/UnitContext';
import { usePeriod } from '@/contexts/PeriodContext';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'export-dre' | 'set-goals' | 'view-reports' | 'unit-analysis' | null;
  onReportClick?: (report: Report) => void;
}

const unitAnalysisData = [
  { unit: 'Campo Grande', receita: 98500, despesa: 76800, lucro: 21700 },
  { unit: 'Recreio', receita: 87200, despesa: 68500, lucro: 18700 },
  { unit: 'Barra', receita: 60080, despesa: 46700, lucro: 13380 }
];

const reportsData = monthlyData.map(item => ({
  mes: item.month.substring(0, 3),
  dre: item.receita - item.despesa,
  fluxo: (item.receita - item.despesa) * 0.95
}));

export const QuickActionModal = ({ isOpen, onClose, actionType, onReportClick }: QuickActionModalProps) => {
  const { goals, isLoading, exportDRE, updateGoal, addGoal, generateReport } = useQuickActions();
  const { getRelatedReports } = useReports();
  const { selectedUnit, getUnitDisplayName } = useUnit();
  const { periodFilter } = usePeriod();
  
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    period: 'current',
    format: 'pdf',
    units: ['all']
  });
  const [newGoal, setNewGoal] = useState({ meta: '', tipo: 'receita' as const, objetivo: 0 });
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [drePreviewData, setDrePreviewData] = useState<any>(null);

  // Update DRE preview data when export config changes
  useEffect(() => {
    if (actionType === 'export-dre') {
      console.log('🔄 [QuickActionModal] Updating DRE preview data');
      console.log('📊 Export config:', exportConfig);
      console.log('📅 Period filter:', periodFilter);
      
      // Determine which period to use based on export config
      let period = periodFilter;
      if (exportConfig.period === 'previous') {
        // Calculate previous month
        const prevMonth = periodFilter.month === 1 ? 12 : periodFilter.month - 1;
        const prevYear = periodFilter.month === 1 ? periodFilter.year - 1 : periodFilter.year;
        period = { ...periodFilter, month: prevMonth, year: prevYear };
      } else if (exportConfig.period === 'semester') {
        // For semester, we'll use YTD view
        period = { ...periodFilter, viewType: 'ytd' as const };
      }
      
      // Get consolidated data for selected units
      const dreData = getConsolidatedDREData(exportConfig.units, period);
      setDrePreviewData(dreData);
      
      console.log('📈 [QuickActionModal] DRE preview data updated:', dreData);
    }
  }, [actionType, exportConfig, periodFilter]);

  if (!actionType) return null;

  const handleExportDRE = () => {
    exportDRE(exportConfig);
  };

  const handleUpdateGoal = (goalId: string, objetivo: number) => {
    updateGoal(goalId, { objetivo });
    setEditingGoal(null);
  };

  const handleAddGoal = () => {
    if (newGoal.meta && newGoal.objetivo > 0) {
      addGoal({
        meta: newGoal.meta,
        tipo: newGoal.tipo,
        atual: 0,
        objetivo: newGoal.objetivo
      });
      setNewGoal({ meta: '', tipo: 'receita', objetivo: 0 });
    }
  };

  const relatedReports = getRelatedReports('receita-total');

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
                      <input 
                        type="radio" 
                        name="period" 
                        checked={exportConfig.period === 'current'}
                        onChange={() => setExportConfig(prev => ({ ...prev, period: 'current' }))}
                      />
                      <span>Junho 2024</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="period" 
                        checked={exportConfig.period === 'previous'}
                        onChange={() => setExportConfig(prev => ({ ...prev, period: 'previous' }))}
                      />
                      <span>Maio 2024</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="period" 
                        checked={exportConfig.period === 'semester'}
                        onChange={() => setExportConfig(prev => ({ ...prev, period: 'semester' }))}
                      />
                      <span>1º Semestre 2024</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium mb-2">Formato</h5>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="format" 
                        checked={exportConfig.format === 'pdf'}
                        onChange={() => setExportConfig(prev => ({ ...prev, format: 'pdf' }))}
                      />
                      <span>PDF Detalhado</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="format" 
                        checked={exportConfig.format === 'excel'}
                        onChange={() => setExportConfig(prev => ({ ...prev, format: 'excel' }))}
                      />
                      <span>Excel (XLSX)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="format" 
                        checked={exportConfig.format === 'csv'}
                        onChange={() => setExportConfig(prev => ({ ...prev, format: 'csv' }))}
                      />
                      <span>CSV</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h5 className="font-medium mb-2">Unidades</h5>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={exportConfig.units.includes('all')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setExportConfig(prev => ({ ...prev, units: ['all'] }));
                        }
                      }}
                    />
                    <span>Todas as Unidades</span>
                  </label>
                  {[
                    { id: 'campo-grande', name: 'Campo Grande' },
                    { id: 'recreio', name: 'Recreio' },
                    { id: 'barra', name: 'Barra' }
                  ].map(unit => (
                    <label key={unit.id} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={exportConfig.units.includes(unit.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setExportConfig(prev => ({ 
                              ...prev, 
                              units: prev.units.filter(u => u !== 'all').concat(unit.id)
                            }));
                          } else {
                            setExportConfig(prev => ({ 
                              ...prev, 
                              units: prev.units.filter(u => u !== unit.id)
                            }));
                          }
                        }}
                      />
                      <span>{unit.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </Card>

            {/* Dynamic DRE Preview */}
            <Card className="p-4">
              <h5 className="font-medium mb-2">
                Preview do DRE - {drePreviewData?.periodLabel || 'Carregando...'}
              </h5>
              {drePreviewData ? (
                <div className="text-sm space-y-1 bg-gray-50 p-4 rounded">
                  <div className="flex justify-between font-semibold border-b pb-1">
                    <span>RECEITAS</span>
                    <span>R$ {drePreviewData.receitas.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pl-4">
                    <span>Mensalidades</span>
                    <span>R$ {drePreviewData.receitas.mensalidades.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pl-4">
                    <span>Matrículas</span>
                    <span>R$ {drePreviewData.receitas.matriculas.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pl-4">
                    <span>Outras Receitas</span>
                    <span>R$ {drePreviewData.receitas.outras.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between font-semibold border-b pb-1 pt-2">
                    <span>DESPESAS</span>
                    <span>R$ {drePreviewData.despesas.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pl-4">
                    <span>Pessoal</span>
                    <span>R$ {drePreviewData.despesas.pessoal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pl-4">
                    <span>Aluguel</span>
                    <span>R$ {drePreviewData.despesas.aluguel.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pl-4">
                    <span>Marketing</span>
                    <span>R$ {drePreviewData.despesas.marketing.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pl-4">
                    <span>Operacional</span>
                    <span>R$ {drePreviewData.despesas.operacional.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pl-4">
                    <span>Outros</span>
                    <span>R$ {drePreviewData.despesas.outros.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>LUCRO LÍQUIDO</span>
                    <span className={`${drePreviewData.lucroLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R$ {drePreviewData.lucroLiquido.toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded">
                  Carregando preview...
                </div>
              )}
            </Card>

            {/* Related Reports */}
            {onReportClick && (
              <Card className="p-4">
                <h5 className="font-medium mb-3">Relatórios Relacionados</h5>
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

            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                onClick={handleExportDRE}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                {isLoading ? 'Exportando...' : 'Exportar DRE'}
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
                {goals.map((goal) => (
                  <div key={goal.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium">{goal.meta}</h5>
                      <span className={`text-sm font-medium ${goal.progresso >= 95 ? 'text-green-600' : goal.progresso >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {goal.progresso.toFixed(1)}%
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
                            className={`h-2 rounded-full transition-all duration-300 ${goal.progresso >= 95 ? 'bg-green-500' : goal.progresso >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(goal.progresso, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      {editingGoal === goal.id ? (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            className="w-20 px-2 py-1 border rounded text-sm"
                            defaultValue={goal.objetivo}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleUpdateGoal(goal.id, Number((e.target as HTMLInputElement).value));
                              }
                            }}
                          />
                          <Button size="sm" onClick={() => setEditingGoal(null)}>
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => setEditingGoal(goal.id)}>
                          Editar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h5 className="font-medium mb-4">Adicionar Nova Meta</h5>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome da Meta</label>
                    <input 
                      type="text" 
                      className="w-full border rounded px-3 py-2" 
                      placeholder="Nome da meta"
                      value={newGoal.meta}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, meta: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo de Meta</label>
                    <select 
                      className="w-full border rounded px-3 py-2"
                      value={newGoal.tipo}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, tipo: e.target.value as any }))}
                    >
                      <option value="receita">Receita</option>
                      <option value="despesa">Despesa</option>
                      <option value="alunos">Alunos</option>
                      <option value="ticket">Ticket Médio</option>
                      <option value="margem">Margem</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Valor da Meta</label>
                  <input 
                    type="number" 
                    className="w-full border rounded px-3 py-2" 
                    placeholder="0"
                    value={newGoal.objetivo || ''}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, objetivo: Number(e.target.value) }))}
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleAddGoal}
                  disabled={!newGoal.meta || !newGoal.objetivo}
                >
                  Adicionar Meta
                </Button>
              </div>
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
                    ].map((report) => (
                      <div key={report} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{report}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => generateReport(report)}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          ) : (
                            <Download className="w-3 h-3 mr-1" />
                          )}
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

            {/* Related Reports */}
            {onReportClick && (
              <Card className="p-4">
                <h5 className="font-medium mb-3">Relatórios Relacionados</h5>
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

const getModalTitle = (actionType: string) => {
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
