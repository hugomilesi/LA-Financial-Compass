
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, DollarSign, Target, AlertTriangle } from 'lucide-react';
import { UnitPerformanceData } from '@/types/unitPerformance';

interface UnitHighlightsProps {
  data: UnitPerformanceData[];
  onUnitClick: (unitId: string) => void;
}

export const UnitHighlights = ({ data, onUnitClick }: UnitHighlightsProps) => {
  const getHealthColor = (profitMargin: number) => {
    if (profitMargin >= 20) return 'bg-green-500';
    if (profitMargin >= 15) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getHealthLabel = (profitMargin: number) => {
    if (profitMargin >= 20) return 'Excelente';
    if (profitMargin >= 15) return 'Bom';
    return 'Atenção';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((unit) => (
        <Card 
          key={unit.unitId} 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onUnitClick(unit.unitId)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{unit.unitName}</CardTitle>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getHealthColor(unit.financial.profitMargin)}`} />
                <Badge variant="outline" className="text-xs">
                  {getHealthLabel(unit.financial.profitMargin)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  Receita
                </div>
                <div className="text-lg font-semibold">
                  {unit.financial.revenue.toLocaleString('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL',
                    minimumFractionDigits: 0
                  })}
                </div>
                <div className={`flex items-center gap-1 text-xs ${unit.financial.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {unit.financial.revenueGrowth >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(unit.financial.revenueGrowth).toFixed(1)}%
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  Alunos
                </div>
                <div className="text-lg font-semibold">{unit.operational.students}</div>
                <div className="text-xs text-gray-500">
                  {unit.operational.occupancy}% ocupação
                </div>
              </div>
            </div>

            {/* Profit Margin */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Margem de Lucro</span>
                <span className="font-medium">{unit.financial.profitMargin.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getHealthColor(unit.financial.profitMargin)}`}
                  style={{ width: `${Math.min(100, unit.financial.profitMargin * 2)}%` }}
                />
              </div>
            </div>

            {/* Strategic Score */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Target className="w-4 h-4" />
                Satisfação
              </div>
              <div className="text-sm font-medium">
                {unit.strategic.customerSatisfaction}%
              </div>
            </div>

            {/* Alerts */}
            {unit.alerts.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                <AlertTriangle className="w-3 h-3" />
                {unit.alerts.length} alerta{unit.alerts.length !== 1 ? 's' : ''}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
