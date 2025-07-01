
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, TrendingUp, Users, DollarSign, Download, RefreshCw, BarChart3, Percent } from 'lucide-react';
import { useUnitPerformance } from '@/hooks/useUnitPerformance';
import { usePeriod } from '@/contexts/PeriodContext';
import { useUnit } from '@/contexts/UnitContext';
import { UnitHighlights } from './unitPerformance/UnitHighlights';
import { ComparativeCharts } from './unitPerformance/ComparativeCharts';
import { UnitRankings } from './unitPerformance/UnitRankings';
import { UnitDetailModal } from './unitPerformance/UnitDetailModal';

export const UnitPerformancePage = () => {
  console.log('🎯 [UnitPerformancePage] Component is rendering...');
  
  const { 
    performanceData, 
    comparisons, 
    rankings, 
    isLoading, 
    getUnitPerformance,
    refreshData 
  } = useUnitPerformance();
  
  console.log('📊 [UnitPerformancePage] Hook data:', {
    performanceDataLength: performanceData?.length || 0,
    comparisonsLength: comparisons?.length || 0,
    rankingsLength: rankings?.length || 0,
    isLoading
  });
  
  const { getDisplayPeriod } = usePeriod();
  const { selectedUnit, setSelectedUnit, getUnitDisplayName } = useUnit();
  
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('highlights');
  const [viewMode, setViewMode] = useState<'all' | 'financial' | 'operational' | 'strategic'>('all');

  const selectedUnitData = selectedUnitId ? getUnitPerformance(selectedUnitId) : null;

  // Filter data based on selected unit
  const filteredData = selectedUnit === 'all' 
    ? performanceData 
    : performanceData.filter(unit => unit.unitId === selectedUnit);

  // Filter comparisons and rankings based on selected unit  
  const filteredComparisons = selectedUnit === 'all'
    ? comparisons
    : comparisons.map(comp => ({
        ...comp,
        units: comp.units.filter(unit => unit.unitId === selectedUnit)
      })).filter(comp => comp.units.length > 0);

  const filteredRankings = selectedUnit === 'all'
    ? rankings
    : rankings.filter(rank => rank.unitId === selectedUnit);

  const handleExportData = () => {
    console.log('📤 [UnitPerformancePage] Exporting data...');
    try {
      const dataToExport = filteredData;
      const csvContent = [
        ['Unidade', 'Receita', 'Despesa', 'Lucro', 'Margem %', 'Alunos', 'Ocupação %', 'Ticket Médio', 'Satisfação %'],
        ...dataToExport.map(unit => [
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
      link.download = `desempenho-unidades-${selectedUnit}-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } catch (error) {
      console.error('❌ [UnitPerformancePage] Export error:', error);
    }
  };

  console.log('🔄 [UnitPerformancePage] Rendering state - isLoading:', isLoading);

  if (isLoading) {
    console.log('⏳ [UnitPerformancePage] Showing loading state');
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

  console.log('📈 [UnitPerformancePage] Calculating summary metrics...');

  // Calculate summary metrics with error handling
  const totalRevenue = filteredData?.reduce((sum, unit) => {
    const revenue = unit?.financial?.revenue || 0;
    return sum + revenue;
  }, 0) || 0;
  
  const totalStudents = filteredData?.reduce((sum, unit) => {
    const students = unit?.operational?.students || 0;
    return sum + students;
  }, 0) || 0;
  
  const averageProfitMargin = filteredData?.length > 0 
    ? (filteredData.reduce((sum, unit) => sum + (unit?.financial?.profitMargin || 0), 0) / filteredData.length)
    : 0;
    
  const averageRevenueGrowth = filteredData?.length > 0
    ? (filteredData.reduce((sum, unit) => sum + (unit?.financial?.revenueGrowth || 0), 0) / filteredData.length)
    : 0;

  console.log('💰 [UnitPerformancePage] Summary metrics:', {
    totalRevenue,
    totalStudents,
    averageProfitMargin,
    averageRevenueGrowth,
    unitsCount: filteredData?.length || 0
  });

  // Error fallback
  if (!performanceData || performanceData.length === 0) {
    console.log('⚠️ [UnitPerformancePage] No performance data available');
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Nenhum dado disponível</h2>
            <p className="text-gray-600 mb-4">Não foi possível carregar os dados de desempenho das unidades.</p>
            <Button onClick={refreshData} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  console.log('✅ [UnitPerformancePage] Rendering main content with', filteredData.length, 'units');

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Desempenho por Unidade</h1>
          <p className="text-gray-600 mt-1">
            Análise comparativa das unidades • {getDisplayPeriod()} • {getUnitDisplayName(selectedUnit)}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <Select value={selectedUnit} onValueChange={setSelectedUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecionar unidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Unidades</SelectItem>
              <SelectItem value="campo-grande">Campo Grande</SelectItem>
              <SelectItem value="recreio">Recreio</SelectItem>
              <SelectItem value="barra">Barra</SelectItem>
            </SelectContent>
          </Select>

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
              {filteredData.length} unidade{filteredData.length !== 1 ? 's' : ''} 
              {selectedUnit !== 'all' ? '' : ' ativas'}
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
              Base de estudantes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Percent className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Margem de Lucro Média</span>
            </div>
            <div className="text-2xl font-bold">{averageProfitMargin.toFixed(1)}%</div>
            <div className="text-xs text-gray-500 mt-1">
              Meta: 20%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-600">Crescimento Médio</span>
            </div>
            <div className="text-2xl font-bold">
              {averageRevenueGrowth >= 0 ? '+' : ''}{averageRevenueGrowth.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Receita vs período anterior
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
            data={filteredData}
            onUnitClick={setSelectedUnitId}
          />
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <ComparativeCharts 
            data={filteredData}
            comparisons={filteredComparisons}
            onChartClick={(metric, unitId) => setSelectedUnitId(unitId)}
          />
        </TabsContent>

        <TabsContent value="rankings" className="space-y-6">
          <UnitRankings 
            rankings={filteredRankings}
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
