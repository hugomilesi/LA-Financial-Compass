
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, TrendingUp, Users, DollarSign, Download, RefreshCw, BarChart3 } from 'lucide-react';
import { useUnitPerformance } from '@/hooks/useUnitPerformance';
import { usePeriod } from '@/contexts/PeriodContext';
import { UnitHighlights } from './unitPerformance/UnitHighlights';
import { ComparativeCharts } from './unitPerformance/ComparativeCharts';
import { UnitRankings } from './unitPerformance/UnitRankings';
import { UnitDetailModal } from './unitPerformance/UnitDetailModal';

export const UnitPerformancePage = () => {
  const { 
    performanceData, 
    comparisons, 
    rankings, 
    isLoading, 
    getUnitPerformance,
    refreshData 
  } = useUnitPerformance();
  
  const { getDisplayPeriod } = usePeriod();
  
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('highlights');
  const [viewMode, setViewMode] = useState<'all' | 'financial' | 'operational' | 'strategic'>('all');

  const selectedUnitData = selectedUnitId ? getUnitPerformance(selectedUnitId) : null;

  const handleExportData = () => {
    const csvContent = [
      ['Unidade', 'Receita', 'Despesa', 'Lucro', 'Margem %', 'Alunos', 'Ocupação %', 'Ticket Médio', 'Satisfação %'],
      ...performanceData.map(unit => [
        unit.unitName,
        unit.financial.revenue.toLocaleString('pt-BR'),
        unit.financial.expenses.toLocaleString('pt-BR'),
        unit.financial.profit.toLocaleString('pt-BR'),
        unit.financial.profitMargin.toFixed(2),
        unit.operational.students.toString(),
        unit.operational.occupancy.toString(),
        unit.operational.averageTicket.toLocaleString('pt-BR'),
        unit.strategic.customerSatisfaction.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `desempenho-unidades-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Carregando dados de desempenho...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate summary metrics
  const totalRevenue = performanceData.reduce((sum, unit) => sum + unit.financial.revenue, 0);
  const totalStudents = performanceData.reduce((sum, unit) => sum + unit.operational.students, 0);
  const averageOccupancy = performanceData.reduce((sum, unit) => sum + unit.operational.occupancy, 0) / performanceData.length;
  const averageSatisfaction = performanceData.reduce((sum, unit) => sum + unit.strategic.customerSatisfaction, 0) / performanceData.length;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Desempenho por Unidade</h1>
          <p className="text-gray-600 mt-1">
            Análise comparativa das unidades • {getDisplayPeriod()}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filtrar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Dados</SelectItem>
              <SelectItem value="financial">Financeiro</SelectItem>
              <SelectItem value="operational">Operacional</SelectItem>
              <SelectItem value="strategic">Estratégico</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={refreshData}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
          
          <Button
            onClick={handleExportData}
            variant="outline"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Receita Total</span>
            </div>
            <div className="text-2xl font-bold">
              {totalRevenue.toLocaleString('pt-BR', { 
                style: 'currency', 
                currency: 'BRL',
                minimumFractionDigits: 0
              })}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {performanceData.length} unidades ativas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total de Alunos</span>
            </div>
            <div className="text-2xl font-bold">{totalStudents.toLocaleString('pt-BR')}</div>
            <div className="text-xs text-gray-500 mt-1">
              {averageOccupancy.toFixed(1)}% ocupação média
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Ocupação Média</span>
            </div>
            <div className="text-2xl font-bold">{averageOccupancy.toFixed(1)}%</div>
            <div className="text-xs text-gray-500 mt-1">
              Meta: 60%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-600">Satisfação Média</span>
            </div>
            <div className="text-2xl font-bold">{averageSatisfaction.toFixed(1)}%</div>
            <div className="text-xs text-gray-500 mt-1">
              Meta: 90%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="highlights">Destaques</TabsTrigger>
          <TabsTrigger value="charts">Comparativos</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
        </TabsList>

        <TabsContent value="highlights" className="space-y-6">
          <UnitHighlights 
            data={performanceData}
            onUnitClick={setSelectedUnitId}
          />
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <ComparativeCharts 
            data={performanceData}
            comparisons={comparisons}
            onChartClick={(metric, unitId) => setSelectedUnitId(unitId)}
          />
        </TabsContent>

        <TabsContent value="rankings" className="space-y-6">
          <UnitRankings 
            rankings={rankings}
            onUnitClick={setSelectedUnitId}
          />
        </TabsContent>
      </Tabs>

      {/* Unit Detail Modal */}
      <UnitDetailModal
        isOpen={!!selectedUnitId}
        onClose={() => setSelectedUnitId(null)}
        unitData={selectedUnitData}
      />
    </div>
  );
};
