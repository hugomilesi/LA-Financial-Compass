
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Calendar, DollarSign, Target } from 'lucide-react';

interface FutureProjectionsProps {
  selectedPeriod: { year: number; month: number };
  selectedUnit: string;
}

export const FutureProjections = ({ selectedPeriod, selectedUnit }: FutureProjectionsProps) => {
  const [projectionPeriod, setProjectionPeriod] = useState('6'); // 6 meses por padrão

  // Dados mockados para demonstração
  const projections = [
    {
      period: 'Próximos 3 meses',
      revenue: 850000,
      growth: 12.5,
      trend: 'up'
    },
    {
      period: 'Próximos 6 meses',
      revenue: 1650000,
      growth: 18.2,
      trend: 'up'
    },
    {
      period: 'Próximo ano',
      revenue: 3200000,
      growth: 15.8,
      trend: 'up'
    }
  ];

  const scenarios = [
    {
      name: 'Cenário Otimista',
      probability: 25,
      revenue: 1800000,
      color: 'text-green-600'
    },
    {
      name: 'Cenário Realista',
      probability: 50,
      revenue: 1650000,
      color: 'text-blue-600'
    },
    {
      name: 'Cenário Conservador',
      probability: 25,
      revenue: 1450000,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Projeções Futuras</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Período de Projeção:</span>
          <Select value={projectionPeriod} onValueChange={setProjectionPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 meses</SelectItem>
              <SelectItem value="6">6 meses</SelectItem>
              <SelectItem value="12">12 meses</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projections.map((projection, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                {projection.period}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Receita Projetada</span>
                  <span className="text-2xl font-bold text-gray-900">
                    R$ {projection.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {projection.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    projection.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {projection.growth}% de crescimento
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Cenários de Projeção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scenarios.map((scenario, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${scenario.color}`}>
                      {scenario.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      {scenario.probability}% probabilidade
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <Progress value={scenario.probability} className="flex-1 mr-4" />
                    <span className="font-bold text-gray-900">
                      R$ {scenario.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Fatores de Influência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-green-700">Fatores Positivos</h4>
                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                  <li>• Lançamento de novos produtos</li>
                  <li>• Expansão de mercado</li>
                  <li>• Melhoria na eficiência operacional</li>
                </ul>
              </div>
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-medium text-red-700">Riscos Identificados</h4>
                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                  <li>• Instabilidade econômica</li>
                  <li>• Aumento da concorrência</li>
                  <li>• Flutuações sazonais</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
