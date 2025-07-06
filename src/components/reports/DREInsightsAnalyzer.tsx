
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Target, BarChart3 } from 'lucide-react';
import { DREData, DREAnalysis } from '@/types/dre';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface DREInsightsAnalyzerProps {
  dreData: DREData;
  historicalData?: DREData[];
  onGenerateInsights: (data: DREData) => Promise<DREAnalysis>;
}

export const DREInsightsAnalyzer = ({
  dreData,
  historicalData = [],
  onGenerateInsights
}: DREInsightsAnalyzerProps) => {
  const [analysis, setAnalysis] = useState<DREAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (dreData) {
      generateAnalysis();
    }
  }, [dreData]);

  const generateAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const analysisResult = await onGenerateInsights(dreData);
      setAnalysis(analysisResult);
    } catch (error) {
      
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getInsightIcon = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getInsightColor = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return 'bg-green-50 border-green-200';
      case 'negative':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  // Prepare chart data
  const marginData = [
    { name: 'Margem Bruta', value: dreData.totals.margins.gross, color: '#22c55e' },
    { name: 'Margem EBITDA', value: dreData.totals.margins.ebitda, color: '#3b82f6' },
    { name: 'Margem Líquida', value: dreData.totals.margins.net, color: '#8b5cf6' }
  ];

  const revenueExpenseData = [
    { name: 'Receitas', value: dreData.totals.totalRevenue, color: '#22c55e' },
    { name: 'Despesas', value: Math.abs(dreData.totals.totalExpenses), color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Análise Inteligente do DRE
            {isAnalyzing && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
            )}
          </CardTitle>
          <CardDescription>
            Insights gerados por IA baseados na análise do DRE
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {analysis?.insights.length || 0}
              </div>
              <div className="text-sm text-gray-600">Insights Identificados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {analysis?.insights.filter(i => i.type === 'positive').length || 0}
              </div>
              <div className="text-sm text-gray-600">Oportunidades</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {analysis?.insights.filter(i => i.type === 'negative').length || 0}
              </div>
              <div className="text-sm text-gray-600">Pontos de Atenção</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="charts">Gráficos</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          {analysis?.insights.map((insight, index) => (
            <Card key={index} className={`border-2 ${getInsightColor(insight.type)}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{insight.title}</h4>
                      <Badge className={getImpactColor(insight.impact)}>
                        {insight.impact === 'high' ? 'Alto Impacto' :
                         insight.impact === 'medium' ? 'Médio Impacto' : 'Baixo Impacto'}
                      </Badge>
                    </div>
                    <p className="text-gray-700">{insight.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {(!analysis?.insights || analysis.insights.length === 0) && (
            <Card>
              <CardContent className="text-center py-8">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-gray-500">
                  {isAnalyzing ? 'Analisando dados...' : 'Nenhum insight disponível no momento'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          {analysis && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Crescimento da Receita</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-3xl font-bold text-green-600">
                      {analysis.trends.revenueGrowth.toFixed(1)}%
                    </div>
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <Progress 
                    value={Math.abs(analysis.trends.revenueGrowth)} 
                    className="h-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Crescimento das Despesas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-3xl font-bold text-red-600">
                      {analysis.trends.expenseGrowth.toFixed(1)}%
                    </div>
                    <TrendingUp className="w-6 h-6 text-red-600" />
                  </div>
                  <Progress 
                    value={Math.abs(analysis.trends.expenseGrowth)} 
                    className="h-2"
                  />
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Tendência das Margens</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={
                      analysis.trends.marginTrend === 'improving' ? 'bg-green-100 text-green-800' :
                      analysis.trends.marginTrend === 'declining' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {analysis.trends.marginTrend === 'improving' ? 'Melhorando' :
                       analysis.trends.marginTrend === 'declining' ? 'Declinando' : 'Estável'}
                    </Badge>
                  </div>
                  <p className="text-gray-600">
                    {analysis.trends.marginTrend === 'improving' && 
                      'As margens estão apresentando tendência de melhoria, indicando maior eficiência operacional.'}
                    {analysis.trends.marginTrend === 'declining' && 
                      'As margens estão em declínio, requerendo atenção para controle de custos e otimização de receitas.'}
                    {analysis.trends.marginTrend === 'stable' && 
                      'As margens permanecem estáveis, mantendo o nível atual de performance.'}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Margens por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: { label: "Margem %", color: "#8884d8" }
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={marginData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Receitas vs Despesas</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    receitas: { label: "Receitas", color: "#22c55e" },
                    despesas: { label: "Despesas", color: "#ef4444" }
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueExpenseData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${(value / 1000).toFixed(0)}k`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {revenueExpenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {analysis?.recommendations.map((recommendation, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-gray-700">{recommendation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {(!analysis?.recommendations || analysis.recommendations.length === 0) && (
            <Card>
              <CardContent className="text-center py-8">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-gray-500">Nenhuma recomendação disponível no momento</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
