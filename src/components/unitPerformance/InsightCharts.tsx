
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { UnitPerformanceData } from '@/types/unitPerformance';

interface InsightChartsProps {
  performanceData: UnitPerformanceData[];
  insights: any[];
}

export const InsightCharts = ({ performanceData, insights }: InsightChartsProps) => {
  

  // Prepare data for charts
  const profitMarginData = performanceData.map(unit => ({
    name: unit.unitName.replace(/\s+/g, '\n'),
    margin: unit.financial.profitMargin,
    revenue: unit.financial.revenue
  }));

  const occupancyData = performanceData.map(unit => ({
    name: unit.unitName.replace(/\s+/g, '\n'),
    occupancy: unit.operational.occupancy,
    capacity: unit.operational.capacity,
    students: unit.operational.students
  }));

  const satisfactionVsRevenueData = performanceData.map(unit => ({
    name: unit.unitName,
    satisfaction: unit.strategic.customerSatisfaction,
    revenue: unit.financial.revenue / 1000, // Convert to thousands for better chart display
    profitMargin: unit.financial.profitMargin
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Margem de Lucro por Unidade</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={profitMarginData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                fontSize={10}
                interval={0}
                height={40}
              />
              <YAxis fontSize={10} />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  `${value.toFixed(1)}%`, 
                  'Margem de Lucro'
                ]}
                labelFormatter={(label) => `Unidade: ${label.replace(/\n/g, ' ')}`}
              />
              <Bar dataKey="margin" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                fontSize={10}
                interval={0}
                height={40}
              />
              <YAxis fontSize={10} />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  `${value}%`, 
                  'Taxa de Ocupação'
                ]}
                labelFormatter={(label) => `Unidade: ${label.replace(/\n/g, ' ')}`}
              />
              <Bar dataKey="occupancy" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Satisfação vs Receita</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={satisfactionVsRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                fontSize={10}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis fontSize={10} />
              <Tooltip 
                formatter={(value: any, name: string) => {
                  if (name === 'satisfaction') return [`${value}%`, 'Satisfação'];
                  if (name === 'revenue') return [`R$ ${(value * 1000).toLocaleString()}`, 'Receita'];
                  return [value, name];
                }}
              />
              <Line 
                type="monotone" 
                dataKey="satisfaction" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Distribuição de Receita</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={profitMarginData}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                dataKey="revenue"
                label={({ name, percent }) => `${name.replace(/\n/g, ' ')}: ${(percent * 100).toFixed(0)}%`}
                fontSize={10}
              >
                {profitMarginData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => [`R$ ${Number(value).toLocaleString()}`, 'Receita']}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
