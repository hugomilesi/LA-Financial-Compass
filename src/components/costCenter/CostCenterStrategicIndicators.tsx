
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { CostCenterCategory } from '@/types/costCenter';

interface CostCenterStrategicIndicatorsProps {
  categories: CostCenterCategory[];
}

export const CostCenterStrategicIndicators = ({
  categories
}: CostCenterStrategicIndicatorsProps) => {
  const totalExpenses = categories.reduce((sum, cat) => sum + cat.totalAmount, 0);
  
  // Indicadores estratégicos
  const strategicIndicators = [
    {
      id: 'efficiency',
      name: 'Eficiência Operacional',
      value: 78,
      target: 85,
      unit: '%',
      trend: 'up',
      status: 'warning',
      description: 'Relação entre despesas operacionais e receita total'
    },
    {
      id: 'productivity',
      name: 'Produtividade por Funcionário',
      value: 4250,
      target: 4500,
      unit: 'R$',
      trend: 'up',
      status: 'good',
      description: 'Receita gerada por funcionário/mês'
    },
    {
      id: 'cost-control',
      name: 'Controle de Custos',
      value: 92,
      target: 90,
      unit: '%',
      trend: 'up',
      status: 'excellent',
      description: 'Percentual de categorias dentro do orçamento'
    },
    {
      id: 'balance',
      name: 'Equilíbrio de Categorias',
      value: 65,
      target: 75,
      unit: '%',
      trend: 'down',
      status: 'warning',
      description: 'Distribuição equilibrada entre categorias'
    }
  ];

  // Análise de concentração de custos
  const costConcentration = categories
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3)
    .reduce((sum, cat) => sum + cat.percentage, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="h-4 w-4" />;
      case 'good':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'critical':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Indicadores Estratégicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategicIndicators.map((indicator) => (
              <div key={indicator.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{indicator.name}</h4>
                  <Badge className={getStatusColor(indicator.status)}>
                    {getStatusIcon(indicator.status)}
                    <span className="ml-1 capitalize">{indicator.status}</span>
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold">
                    {indicator.unit === 'R$' ? formatCurrency(indicator.value) : `${indicator.value}${indicator.unit}`}
                  </span>
                  {indicator.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Meta: {indicator.unit === 'R$' ? formatCurrency(indicator.target) : `${indicator.target}${indicator.unit}`}</span>
                    <span>{((indicator.value / indicator.target) * 100).toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={(indicator.value / indicator.target) * 100} 
                    className="h-2"
                  />
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  {indicator.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Concentração de Custos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {costConcentration.toFixed(1)}%
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Top 3 categorias representam
              </p>
              <Badge variant={costConcentration > 80 ? "destructive" : "secondary"} className="mt-2">
                {costConcentration > 80 ? 'Alta Concentração' : 'Distribuição Equilibrada'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Categorias Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {categories.filter(cat => cat.isActive).length}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                de {categories.length} categorias
              </p>
              <div className="mt-2">
                <Progress 
                  value={(categories.filter(cat => cat.isActive).length / categories.length) * 100} 
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {formatCurrency(totalExpenses / categories.filter(cat => cat.isActive).length)}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                por categoria ativa
              </p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">+5.2% vs mês anterior</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
