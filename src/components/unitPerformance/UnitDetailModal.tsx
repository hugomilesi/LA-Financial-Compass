
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Target, AlertTriangle, Award, Building } from 'lucide-react';
import { UnitPerformanceData } from '@/types/unitPerformance';

interface UnitDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitData: UnitPerformanceData | null;
}

export const UnitDetailModal = ({ isOpen, onClose, unitData }: UnitDetailModalProps) => {
  if (!unitData) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getHealthColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-green-600';
    if (value >= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            {unitData.unitName} - Análise Detalhada
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
            <TabsTrigger value="operational">Operacional</TabsTrigger>
            <TabsTrigger value="strategic">Estratégico</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-600">Receita Total</span>
                  </div>
                  <div className="text-2xl font-bold">{formatCurrency(unitData.financial.revenue)}</div>
                  <div className={`flex items-center gap-1 text-xs ${unitData.financial.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {unitData.financial.revenueGrowth >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(unitData.financial.revenueGrowth).toFixed(1)}% vs mês anterior
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">Alunos Ativos</span>
                  </div>
                  <div className="text-2xl font-bold">{unitData.operational.students}</div>
                  <div className="text-xs text-gray-500">
                    {unitData.operational.occupancy}% da capacidade
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-600">Satisfação</span>
                  </div>
                  <div className="text-2xl font-bold">{unitData.strategic.customerSatisfaction}%</div>
                  <div className="text-xs text-gray-500">
                    Meta: 90%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profit Margin */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Margem de Lucro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Atual</span>
                    <span className={`font-medium ${getHealthColor(unitData.financial.profitMargin, { good: 20, warning: 15 })}`}>
                      {unitData.financial.profitMargin.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={Math.min(100, unitData.financial.profitMargin * 2)} className="h-2" />
                  <div className="text-xs text-gray-500">
                    Lucro: {formatCurrency(unitData.financial.profit)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            {unitData.alerts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Alertas ({unitData.alerts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {unitData.alerts.map((alert) => (
                    <Alert key={alert.id}>
                      <div className="flex items-start gap-3">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{alert.title}</h4>
                          <AlertDescription className="text-xs mt-1">
                            {alert.description}
                          </AlertDescription>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {alert.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {alert.severity}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Evolução Financeira</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={unitData.trends.revenueHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={formatCurrency} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Métricas Financeiras</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Receita</span>
                    <span className="font-medium">{formatCurrency(unitData.financial.revenue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Despesas</span>
                    <span className="font-medium">{formatCurrency(unitData.financial.expenses)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Lucro</span>
                    <span className="font-medium">{formatCurrency(unitData.financial.profit)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Custo por Aluno</span>
                    <span className="font-medium">{formatCurrency(unitData.financial.costPerStudent)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Crescimento</span>
                    <span className={`font-medium ${unitData.financial.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {unitData.financial.revenueGrowth >= 0 ? '+' : ''}{unitData.financial.revenueGrowth.toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="operational" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Evolução de Alunos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={unitData.trends.studentsHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Indicadores Operacionais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Taxa de Ocupação</span>
                      <span className="font-medium">{unitData.operational.occupancy}%</span>
                    </div>
                    <Progress value={unitData.operational.occupancy} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Retenção de Alunos</span>
                      <span className="font-medium">{unitData.operational.studentRetention}%</span>
                    </div>
                    <Progress value={unitData.operational.studentRetention} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Ticket Médio</span>
                    <span className="font-medium">{formatCurrency(unitData.operational.averageTicket)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Matrículas (mês)</span>
                    <span className="font-medium">{unitData.operational.enrollments}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Capacidade Total</span>
                    <span className="font-medium">{unitData.operational.capacity}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="strategic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Indicadores Estratégicos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Satisfação do Cliente</span>
                      <span className="font-medium">{unitData.strategic.customerSatisfaction}%</span>
                    </div>
                    <Progress value={unitData.strategic.customerSatisfaction} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Satisfação dos Professores</span>
                      <span className="font-medium">{unitData.strategic.teacherSatisfaction}%</span>
                    </div>
                    <Progress value={unitData.strategic.teacherSatisfaction} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Engajamento Digital</span>
                      <span className="font-medium">{unitData.strategic.digitalEngagement}%</span>
                    </div>
                    <Progress value={unitData.strategic.digitalEngagement} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Conhecimento da Marca</span>
                      <span className="font-medium">{unitData.strategic.brandAwareness}%</span>
                    </div>
                    <Progress value={unitData.strategic.brandAwareness} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Participação de Mercado</span>
                    <span className="font-medium">{unitData.strategic.marketShare}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Metas vs Realizado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Satisfação (Meta: 90%)</span>
                        <span className={getHealthColor(unitData.strategic.customerSatisfaction, { good: 90, warning: 80 })}>
                          {unitData.strategic.customerSatisfaction}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full relative"
                          style={{ width: `${unitData.strategic.customerSatisfaction}%` }}
                        >
                          <div className="absolute right-0 top-0 h-2 w-0.5 bg-red-500" style={{ right: '10%' }} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Ocupação (Meta: 60%)</span>
                        <span className={getHealthColor(unitData.operational.occupancy, { good: 60, warning: 40 })}>
                          {unitData.operational.occupancy}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full relative"
                          style={{ width: `${unitData.operational.occupancy}%` }}
                        >
                          <div className="absolute right-0 top-0 h-2 w-0.5 bg-red-500" style={{ right: '40%' }} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Margem (Meta: 20%)</span>
                        <span className={getHealthColor(unitData.financial.profitMargin, { good: 20, warning: 15 })}>
                          {unitData.financial.profitMargin.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full relative"
                          style={{ width: `${Math.min(100, unitData.financial.profitMargin * 5)}%` }}
                        >
                          <div className="absolute right-0 top-0 h-2 w-0.5 bg-red-500" style={{ right: '0%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
