
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CostCenterCategory } from '@/types/costCenter';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';

interface CostCenterChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CostCenterCategory[];
}

export const CostCenterChartModal = ({
  isOpen,
  onClose,
  categories
}: CostCenterChartModalProps) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  // Data for different charts
  const pieChartData = categories.map(category => ({
    name: category.name,
    value: category.totalAmount,
    percentage: category.percentage,
    color: category.color
  }));

  const barChartData = categories.map(category => ({
    name: category.name.length > 15 ? category.name.substring(0, 15) + '...' : category.name,
    value: category.totalAmount,
    color: category.color
  }));

  // Unit comparison data
  const unitComparisonData = ['campo-grande', 'recreio', 'barra'].map(unitId => {
    const unitName = unitId === 'campo-grande' ? 'Campo Grande' : 
                    unitId === 'recreio' ? 'Recreio' : 'Barra';
    
    const unitData: any = { name: unitName };
    
    categories.forEach(category => {
      const unitBreakdown = category.unitBreakdown.find(u => u.unitId === unitId);
      unitData[category.name] = unitBreakdown?.amount || 0;
    });
    
    return unitData;
  });

  // Percentage trend data (mock data for demonstration)
  const trendData = [
    { month: 'Jan', ...categories.reduce((acc, cat) => ({ ...acc, [cat.name]: cat.percentage * 0.9 }), {}) },
    { month: 'Fev', ...categories.reduce((acc, cat) => ({ ...acc, [cat.name]: cat.percentage * 0.95 }), {}) },
    { month: 'Mar', ...categories.reduce((acc, cat) => ({ ...acc, [cat.name]: cat.percentage * 0.98 }), {}) },
    { month: 'Abr', ...categories.reduce((acc, cat) => ({ ...acc, [cat.name]: cat.percentage * 1.02 }), {}) },
    { month: 'Mai', ...categories.reduce((acc, cat) => ({ ...acc, [cat.name]: cat.percentage * 1.01 }), {}) },
    { month: 'Jun', ...categories.reduce((acc, cat) => ({ ...acc, [cat.name]: cat.percentage }), {}) }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Análise Gráfica - Centro de Custos</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(categories.reduce((sum, cat) => sum + cat.totalAmount, 0))}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Total Geral</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {categories.length}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Categorias Ativas</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {formatCurrency(categories.reduce((sum, cat) => sum + cat.totalAmount, 0) / categories.length)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Média por Categoria</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={(entry) => `${entry.name}: ${entry.percentage.toFixed(1)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), 'Valor']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Comparação de Valores</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} 
                      fontSize={12} 
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), 'Valor']}
                      labelFormatter={(label) => `Categoria: ${label}`}
                    />
                    <Bar dataKey="value">
                      {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Unit Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Comparação por Unidade</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={unitComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  {categories.map((category) => (
                    <Bar 
                      key={category.id}
                      dataKey={category.name} 
                      fill={category.color}
                      name={category.name}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução Percentual (Últimos 6 Meses)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={(value) => `${value.toFixed(0)}%`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Percentual']}
                  />
                  <Legend />
                  {categories.map((category) => (
                    <Line 
                      key={category.id}
                      type="monotone" 
                      dataKey={category.name} 
                      stroke={category.color}
                      strokeWidth={2}
                      name={category.name}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
