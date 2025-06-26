
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, Calendar } from 'lucide-react';

interface PlanningDashboardProps {
  selectedPeriod: { year: number; month: number };
  selectedUnit: string;
}

export const PlanningDashboard = ({ selectedPeriod, selectedUnit }: PlanningDashboardProps) => {
  // Mock data - replace with real data later
  const kpis = [
    {
      name: 'Receita Mensal',
      current: 185000,
      target: 200000,
      progress: 92.5,
      trend: 'up',
      variation: '+8.5%'
    },
    {
      name: 'Margem de Lucro',
      current: 28.5,
      target: 30,
      progress: 95,
      trend: 'up',
      variation: '+2.1%'
    },
    {
      name: 'Custos Operacionais',
      current: 132000,
      target: 140000,
      progress: 94.3,
      trend: 'down',
      variation: '-5.7%'
    },
    {
      name: 'Alunos Ativos',
      current: 850,
      target: 900,
      progress: 94.4,
      trend: 'up',
      variation: '+3.2%'
    }
  ];

  const monthName = new Date(selectedPeriod.year, selectedPeriod.month - 1).toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Dashboard - {monthName}</h2>
        </div>
        <Badge variant="outline" className="text-sm">
          {selectedUnit === 'all' ? 'Todas as Unidades' : 'Unidade Selecionada'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.name}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{kpi.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {kpi.name.includes('Receita') || kpi.name.includes('Custos') 
                      ? `R$ ${kpi.current.toLocaleString()}`
                      : kpi.name.includes('Margem')
                      ? `${kpi.current}%`
                      : kpi.current.toLocaleString()
                    }
                  </span>
                  <div className="flex items-center gap-1">
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.variation}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Meta</span>
                    <span className="font-medium">
                      {kpi.name.includes('Receita') || kpi.name.includes('Custos') 
                        ? `R$ ${kpi.target.toLocaleString()}`
                        : kpi.name.includes('Margem')
                        ? `${kpi.target}%`
                        : kpi.target.toLocaleString()
                      }
                    </span>
                  </div>
                  <Progress value={kpi.progress} className="h-2" />
                  <div className="text-right">
                    <span className="text-sm text-gray-500">{kpi.progress.toFixed(1)}% da meta</span>
                  </div>
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
              <Target className="h-5 w-5" />
              Resumo de Metas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Metas Atingidas</span>
                <Badge variant="secondary">3 de 4</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Média de Atingimento</span>
                <span className="font-semibold text-green-600">94.0%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Projeção Próximo Mês</span>
                <span className="font-semibold text-blue-600">96.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas Ações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium">Revisar meta de Receita</p>
                  <p className="text-xs text-gray-500">Ajustar para próximo mês</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium">Analisar custos operacionais</p>
                  <p className="text-xs text-gray-500">Identificar oportunidades</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium">Definir estratégia de captação</p>
                  <p className="text-xs text-gray-500">Aumentar base de alunos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
