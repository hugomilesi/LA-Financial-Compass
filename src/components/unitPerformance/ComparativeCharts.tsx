
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { UnitComparison, UnitPerformanceData } from '@/types/unitPerformance';

interface ComparativeChartsProps {
  data: UnitPerformanceData[];
  comparisons: UnitComparison[];
  onChartClick?: (metric: string, unitId: string) => void;
}

export const ComparativeCharts = ({ data, comparisons, onChartClick }: ComparativeChartsProps) => {
  const getFinancialChartData = () => {
    return data.map(unit => ({
      name: unit.unitName,
      receita: unit.financial.revenue,
      despesa: unit.financial.expenses,
      lucro: unit.financial.profit,
      margem: unit.financial.profitMargin
    }));
  };

  const getOperationalChartData = () => {
    return data.map(unit => ({
      name: unit.unitName,
      alunos: unit.operational.students,
      ocupacao: unit.operational.occupancy,
      ticket: unit.operational.averageTicket,
      retencao: unit.operational.studentRetention
    }));
  };

  const getStrategicChartData = () => {
    return data.map(unit => ({
      name: unit.unitName,
      satisfacao: unit.strategic.customerSatisfaction,
      professores: unit.strategic.teacherSatisfaction,
      digital: unit.strategic.digitalEngagement,
      marca: unit.strategic.brandAwareness,
      mercado: unit.strategic.marketShare
    }));
  };

  const getTrendData = () => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    return months.map(month => {
      const monthData: any = { month };
      data.forEach(unit => {
        const revenuePoint = unit.trends.revenueHistory.find(h => h.month === month);
        monthData[unit.unitName] = revenuePoint?.value || 0;
      });
      return monthData;
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {typeof entry.value === 'number' && entry.value > 1000 
                ? formatCurrency(entry.value) 
                : `${entry.value}${entry.name.includes('margem') || entry.name.includes('ocupacao') || entry.name.includes('retencao') || entry.name.includes('satisfacao') ? '%' : ''}`
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="financial" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="operational">Operacional</TabsTrigger>
          <TabsTrigger value="strategic">Estratégico</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Receita vs Despesa</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getFinancialChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="receita" fill="#10B981" name="Receita" />
                  <Bar dataKey="despesa" fill="#EF4444" name="Despesa" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Margem de Lucro</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getFinancialChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="margem" fill="#3B82F6" name="Margem %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operational" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alunos e Ocupação</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getOperationalChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar yAxisId="left" dataKey="alunos" fill="#10B981" name="Alunos" />
                  <Bar yAxisId="right" dataKey="ocupacao" fill="#F59E0B" name="Ocupação %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ticket Médio e Retenção</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getOperationalChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar yAxisId="left" dataKey="ticket" fill="#8B5CF6" name="Ticket Médio" />
                  <Bar yAxisId="right" dataKey="retencao" fill="#06B6D4" name="Retenção %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Indicadores Estratégicos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={getStrategicChartData()}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Satisfação" dataKey="satisfacao" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                  <Radar name="Professores" dataKey="professores" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                  <Radar name="Digital" dataKey="digital" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evolução da Receita</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={getTrendData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip content={<CustomTooltip />} />
                  {data.map((unit, index) => (
                    <Line 
                      key={unit.unitId}
                      type="monotone" 
                      dataKey={unit.unitName} 
                      stroke={['#10B981', '#3B82F6', '#8B5CF6'][index]} 
                      strokeWidth={2}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
