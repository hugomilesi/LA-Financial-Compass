
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Target, Award, AlertTriangle } from 'lucide-react';
import { CostCenterMetrics as Metrics } from '@/types/costCenter';

interface CostCenterMetricsProps {
  metrics: Metrics;
}

export const CostCenterMetrics = ({ metrics }: CostCenterMetricsProps) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(metrics.totalExpenses)}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            {metrics.monthlyGrowth >= 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={metrics.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
              {formatPercentage(Math.abs(metrics.monthlyGrowth))} vs mês anterior
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categorias Ativas</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.categoryCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Média: {formatCurrency(metrics.averagePerCategory)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Maior Categoria</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatPercentage(metrics.highestCategory.percentage)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {metrics.highestCategory.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(metrics.highestCategory.amount)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Menor Categoria</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatPercentage(metrics.lowestCategory.percentage)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {metrics.lowestCategory.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(metrics.lowestCategory.amount)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
