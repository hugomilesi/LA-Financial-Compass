import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, FileText, TrendingUp, DollarSign, Calendar, Settings, Brain, Wrench } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { ReportBuilder } from '@/components/reports/ReportBuilder';
import { SavedReportsManager } from '@/components/reports/SavedReportsManager';
import { ReportScheduler } from '@/components/reports/ReportScheduler';
import { AdvancedExportOptions } from '@/components/reports/AdvancedExportOptions';
import { DREStructureBuilder } from '@/components/reports/DREStructureBuilder';
import { DRETemplateManager } from '@/components/reports/DRETemplateManager';
import { DREGenerator } from '@/components/reports/DREGenerator';
import { DREInsightsAnalyzer } from '@/components/reports/DREInsightsAnalyzer';
import { useToast } from '@/hooks/use-toast';
import { DRETemplate, DREConfiguration, DREData, DREAnalysis } from '@/types/dre';
import { Account } from '@/types/chartOfAccounts';
import { CostCenterCategory } from '@/types/costCenter';

export const ReportsDREPage = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  
  // DRE Templates State
  const [dreTemplates, setDreTemplates] = useState<DRETemplate[]>([
    {
      id: '1',
      name: 'DRE Padrão',
      description: 'Estrutura padrão do DRE gerencial',
      structure: [
        {
          id: '1',
          code: '3.01',
          name: 'Receita Bruta',
          type: 'revenue',
          level: 0,
          accounts: [],
          costCenters: [],
          isCalculated: false,
          isVisible: true,
          order: 0
        },
        {
          id: '2',
          code: '3.02',
          name: 'Deduções',
          type: 'expense',
          level: 0,
          accounts: [],
          costCenters: [],
          isCalculated: false,
          isVisible: true,
          order: 1
        }
      ],
      isDefault: true,
      isPublic: true,
      createdBy: 'system',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      tags: ['padrão', 'gerencial']
    }
  ]);

  const [currentTemplate, setCurrentTemplate] = useState<DRETemplate | null>(null);
  const [generatedDRE, setGeneratedDRE] = useState<DREData | null>(null);
  
  // Mock data for existing components
  const [savedReports, setSavedReports] = useState([
    {
      id: '1',
      name: 'DRE Mensal Completo',
      description: 'Relatório completo com todas as contas',
      type: 'dre' as const,
      createdAt: new Date('2024-01-15'),
      lastUsed: new Date('2024-06-28'),
      usageCount: 12,
      isTemplate: true
    },
    {
      id: '2',
      name: 'Análise de Custos por Unidade',
      description: 'Breakdown detalhado de custos',
      type: 'custos' as const,
      createdAt: new Date('2024-02-10'),
      lastUsed: null,
      usageCount: 5,
      isTemplate: false
    }
  ]);

  const [scheduledReports, setScheduledReports] = useState([
    {
      id: '1',
      name: 'DRE Mensal Automático',
      reportId: '1',
      frequency: 'monthly' as const,
      dayOfMonth: 5,
      time: '09:00',
      recipients: ['gerencia@empresa.com', 'diretoria@empresa.com'],
      format: 'pdf' as const,
      isActive: true,
      nextRun: new Date('2024-07-05'),
      lastRun: new Date('2024-06-05')
    }
  ]);

  // Mock data for charts
  const dreData = [
    { item: 'Receita Bruta', valor: 850000, percentual: 100 },
    { item: 'Deduções', valor: -85000, percentual: -10 },
    { item: 'Receita Líquida', valor: 765000, percentual: 90 },
    { item: 'CMV', valor: -306000, percentual: -36 },
    { item: 'Lucro Bruto', valor: 459000, percentual: 54 },
    { item: 'Despesas Operacionais', valor: -255000, percentual: -30 },
    { item: 'EBITDA', valor: 204000, percentual: 24 },
    { item: 'Depreciação', valor: -25500, percentual: -3 },
    { item: 'EBIT', valor: 178500, percentual: 21 },
    { item: 'Resultado Financeiro', valor: -12750, percentual: -1.5 },
    { item: 'Lucro Antes do IR', valor: 165750, percentual: 19.5 },
    { item: 'IR/CSLL', valor: -41437.5, percentual: -4.9 },
    { item: 'Lucro Líquido', valor: 124312.5, percentual: 14.6 }
  ];

  const monthlyData = [
    { mes: 'Jan', receita: 65000, despesas: 45000, lucro: 20000 },
    { mes: 'Fev', receita: 70000, despesas: 48000, lucro: 22000 },
    { mes: 'Mar', receita: 75000, despesas: 50000, lucro: 25000 },
    { mes: 'Abr', receita: 68000, despesas: 47000, lucro: 21000 },
    { mes: 'Mai', receita: 72000, despesas: 49000, lucro: 23000 },
    { mes: 'Jun', receita: 78000, despesas: 52000, lucro: 26000 }
  ];

  const costCenterData = [
    { centro: 'Vendas', valor: 125000, cor: '#8884d8' },
    { centro: 'Marketing', valor: 85000, cor: '#82ca9d' },
    { centro: 'Administrativo', valor: 95000, cor: '#ffc658' },
    { centro: 'Operacional', valor: 110000, cor: '#ff7300' }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // DRE Template handlers
  const handleSaveTemplate = (template: Omit<DRETemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: DRETemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setDreTemplates(prev => [...prev, newTemplate]);
    toast({
      title: "Template salvo",
      description: "O template DRE foi salvo com sucesso"
    });
  };

  const handleEditTemplate = (template: DRETemplate) => {
    setCurrentTemplate(template);
    toast({
      title: "Editando template",
      description: `Abrindo editor para ${template.name}`
    });
  };

  const handleDeleteTemplate = (templateId: string) => {
    setDreTemplates(prev => prev.filter(t => t.id !== templateId));
    toast({
      title: "Template excluído",
      description: "O template foi removido com sucesso"
    });
  };

  const handleDuplicateTemplate = (template: DRETemplate) => {
    const newTemplate: DRETemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Cópia)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDefault: false
    };
    setDreTemplates(prev => [...prev, newTemplate]);
    toast({
      title: "Template duplicado",
      description: `Criada cópia: ${newTemplate.name}`
    });
  };

  const handleSetDefaultTemplate = (templateId: string) => {
    setDreTemplates(prev => prev.map(t => ({
      ...t,
      isDefault: t.id === templateId
    })));
    toast({
      title: "Template padrão definido",
      description: "O template foi definido como padrão"
    });
  };

  const handleImportTemplate = (file: File) => {
    // Implementation would parse JSON file and add template
    toast({
      title: "Template importado",
      description: "O template foi importado com sucesso"
    });
  };

  const handleExportTemplate = (template: DRETemplate) => {
    const dataStr = JSON.stringify(template, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${template.name.replace(/\s+/g, '_')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // DRE Generation handlers
  const handleGenerateDRE = async (config: DREConfiguration): Promise<DREData> => {
    // Mock DRE generation
    const mockData: DREData = {
      configuration: config,
      lineItems: dreTemplates.find(t => t.id === config.templateId)?.structure.map(item => ({
        ...item,
        value: Math.random() * 100000 - 50000,
        percentageOfRevenue: Math.random() * 100,
        variance: Math.random() * 10000 - 5000,
        variancePercentage: Math.random() * 20 - 10
      })) || [],
      totals: {
        totalRevenue: 850000,
        totalExpenses: 650000,
        grossProfit: 459000,
        netProfit: 124312.5,
        ebitda: 204000,
        margins: {
          gross: 54,
          net: 14.6,
          ebitda: 24
        }
      },
      metadata: {
        generatedAt: new Date(),
        generatedBy: 'current-user',
        dataSource: 'sistema'
      }
    };
    
    setGeneratedDRE(mockData);
    return mockData;
  };

  const handleGenerateInsights = async (data: DREData): Promise<DREAnalysis> => {
    // Mock AI analysis
    return {
      trends: {
        revenueGrowth: 8.5,
        expenseGrowth: 5.2,
        marginTrend: 'improving'
      },
      insights: [
        {
          type: 'positive',
          title: 'Crescimento Sustentável da Receita',
          description: 'A receita apresentou crescimento de 8.5% no período, superando as expectativas.',
          impact: 'high'
        },
        {
          type: 'negative',
          title: 'Aumento dos Custos Operacionais',
          description: 'Os custos operacionais cresceram 5.2%, requerendo atenção para otimização.',
          impact: 'medium'
        }
      ],
      recommendations: [
        'Implementar controles mais rigorosos sobre custos operacionais',
        'Analisar oportunidades de otimização de processos',
        'Considerar automação de atividades repetitivas'
      ]
    };
  };

  // Report Builder handlers
  const handleSaveReportTemplate = (template: any) => {
    console.log('Saving template:', template);
    toast({
      title: "Template salvo",
      description: "O template foi salvo com sucesso"
    });
  };

  const handlePreviewReport = (template: any) => {
    console.log('Previewing report:', template);
    toast({
      title: "Visualização gerada",
      description: "Confira a prévia do seu relatório"
    });
  };

  // Saved Reports handlers
  const handleEditReport = (report: any) => {
    console.log('Editing report:', report);
    toast({
      title: "Editando relatório",
      description: `Abrindo editor para ${report.name}`
    });
  };

  const handleDeleteReport = (reportId: string) => {
    setSavedReports(prev => prev.filter(r => r.id !== reportId));
    toast({
      title: "Relatório excluído",
      description: "O relatório foi removido com sucesso"
    });
  };

  const handleDuplicateReport = (report: any) => {
    const newReport = {
      ...report,
      id: Date.now().toString(),
      name: `${report.name} (Cópia)`,
      createdAt: new Date(),
      lastUsed: null,
      usageCount: 0
    };
    setSavedReports(prev => [...prev, newReport]);
    toast({
      title: "Relatório duplicado",
      description: `Criada cópia: ${newReport.name}`
    });
  };

  const handleGenerateReport = (report: any) => {
    console.log('Generating report:', report);
    toast({
      title: "Gerando relatório",
      description: `Processando ${report.name}...`
    });
  };

  // Scheduler handlers
  const handleScheduleReport = (schedule: any) => {
    const newSchedule = {
      ...schedule,
      id: Date.now().toString(),
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      lastRun: undefined
    };
    setScheduledReports(prev => [...prev, newSchedule]);
    toast({
      title: "Agendamento criado",
      description: "O relatório foi agendado com sucesso"
    });
  };

  const handleUpdateSchedule = (schedule: any) => {
    setScheduledReports(prev => prev.map(s => s.id === schedule.id ? schedule : s));
    toast({
      title: "Agendamento atualizado",
      description: "As configurações foram salvas"
    });
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    setScheduledReports(prev => prev.filter(s => s.id !== scheduleId));
    toast({
      title: "Agendamento removido",
      description: "O agendamento foi cancelado"
    });
  };

  const handleToggleScheduleActive = (scheduleId: string) => {
    setScheduledReports(prev => prev.map(s => 
      s.id === scheduleId ? { ...s, isActive: !s.isActive } : s
    ));
    toast({
      title: "Status atualizado",
      description: "O agendamento foi atualizado"
    });
  };

  // Export handlers
  const handleExport = (options: any) => {
    console.log('Exporting with options:', options);
    // Implementation would call the enhanced fileDownload utility
  };

  const handleWhatsAppShare = (whatsappOptions: any, exportOptions: any) => {
    console.log('WhatsApp share:', { whatsappOptions, exportOptions });
    // Implementation would integrate with WhatsApp Business API
  };

  const handleEmailShare = (emailOptions: any, exportOptions: any) => {
    console.log('Email share:', { emailOptions, exportOptions });
    // Implementation would use email service
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios & DRE</h1>
          <p className="text-gray-600 mt-2">Sistema completo de relatórios financeiros</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {selectedPeriod}
          </Button>
          <AdvancedExportOptions
            reportData={dreData}
            reportTitle="DRE Gerencial"
            onExport={handleExport}
            onWhatsAppShare={handleWhatsAppShare}
            onEmailShare={handleEmailShare}
          />
        </div>
      </div>

      <Tabs defaultValue="dre" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="dre">DRE Gerencial</TabsTrigger>
          <TabsTrigger value="builder">Construtor</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="generator">Gerador</TabsTrigger>
          <TabsTrigger value="insights">Insights IA</TabsTrigger>
          <TabsTrigger value="saved">Salvos</TabsTrigger>
          <TabsTrigger value="scheduler">Agendamentos</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
        </TabsList>

        <TabsContent value="dre" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  DRE Detalhada - {selectedPeriod}
                </CardTitle>
                <CardDescription>
                  Demonstrativo do Resultado do Exercício
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="text-right">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dreData.map((item, index) => (
                      <TableRow key={index} className={item.valor < 0 ? 'text-red-600' : item.item.includes('Lucro') ? 'text-green-600 font-semibold' : ''}>
                        <TableCell className="font-medium">{item.item}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.valor)}</TableCell>
                        <TableCell className="text-right">{item.percentual.toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evolução Mensal</CardTitle>
                <CardDescription>Receitas vs Despesas vs Lucro</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    receita: { label: "Receita", color: "#8884d8" },
                    despesas: { label: "Despesas", color: "#82ca9d" },
                    lucro: { label: "Lucro", color: "#ffc658" }
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="receita" fill="#8884d8" />
                      <Bar dataKey="despesas" fill="#82ca9d" />
                      <Bar dataKey="lucro" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="builder" className="space-y-6">
          <DREStructureBuilder
            template={currentTemplate}
            accounts={[]} // Would be populated from useChartOfAccounts
            costCenters={[]} // Would be populated from useCostCenterCategories
            onSaveTemplate={handleSaveTemplate}
          />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <DRETemplateManager
            templates={dreTemplates}
            onCreateTemplate={() => setCurrentTemplate(null)}
            onEditTemplate={handleEditTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            onDuplicateTemplate={handleDuplicateTemplate}
            onSetDefault={handleSetDefaultTemplate}
            onImportTemplate={handleImportTemplate}
            onExportTemplate={handleExportTemplate}
          />
        </TabsContent>

        <TabsContent value="generator" className="space-y-6">
          <DREGenerator
            templates={dreTemplates}
            onGenerate={handleGenerateDRE}
            onExport={(data, format) => {
              toast({
                title: "Exportando DRE",
                description: `Gerando arquivo ${format.toUpperCase()}...`
              });
            }}
          />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {generatedDRE ? (
            <DREInsightsAnalyzer
              dreData={generatedDRE}
              onGenerateInsights={handleGenerateInsights}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Gere um DRE primeiro</h3>
                <p className="text-gray-600 mb-4">
                  Para visualizar insights inteligentes, você precisa gerar um DRE usando o Gerador.
                </p>
                <Button onClick={() => document.querySelector('[value="generator"]')?.click()}>
                  <Wrench className="w-4 h-4 mr-2" />
                  Ir para o Gerador
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <SavedReportsManager
            reports={savedReports}
            onEdit={handleEditReport}
            onDelete={handleDeleteReport}
            onDuplicate={handleDuplicateReport}
            onGenerate={handleGenerateReport}
          />
        </TabsContent>

        <TabsContent value="scheduler" className="space-y-6">
          <ReportScheduler
            scheduledReports={scheduledReports}
            availableReports={savedReports.map(r => ({ id: r.id, name: r.name }))}
            onSchedule={handleScheduleReport}
            onUpdate={handleUpdateSchedule}
            onDelete={handleDeleteSchedule}
            onToggleActive={handleToggleScheduleActive}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendência de Lucro</CardTitle>
                <CardDescription>Evolução do lucro líquido mensal</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    lucro: { label: "Lucro", color: "#22c55e" }
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="lucro" 
                        stroke="#22c55e" 
                        strokeWidth={3}
                        dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indicadores Financeiros</CardTitle>
                <CardDescription>Principais métricas do período</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Margem Bruta</span>
                  <span className="font-semibold text-green-600">54.0%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Margem EBITDA</span>
                  <span className="font-semibold text-blue-600">24.0%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Margem Líquida</span>
                  <span className="font-semibold text-purple-600">14.6%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">ROI</span>
                  <span className="font-semibold text-orange-600">19.5%</span>
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-sm font-medium">Crescimento vs Mês Anterior</span>
                  <span className="font-semibold text-green-600">+8.2%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
