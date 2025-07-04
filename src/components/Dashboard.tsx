import { AIInsights } from './AIInsights';
import { KPIDetailModal } from './KPIDetailModal';
import { ChartDetailModal } from './ChartDetailModal';
import { QuickActionModal } from './QuickActionModal';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { KPISections } from './dashboard/KPISections';
import { ChartsSection } from './dashboard/ChartsSection';
import { QuickActions } from './dashboard/QuickActions';
import { Toaster } from '@/components/ui/toaster';
import { useState } from 'react';
import { ReportDetailModal } from './ReportDetailModal';
import { useReports, Report } from '@/hooks/useReports';
import { useUnit } from '@/contexts/UnitContext';
import { RevenueDetailModal } from './kpi/RevenueDetailModal';
import { ExpenseDetailModal } from './kpi/ExpenseDetailModal';
import { CashFlowDetailModal } from './kpi/CashFlowDetailModal';
import { MarginDetailModal } from './kpi/MarginDetailModal';
import { TicketMedioDetailModal } from './kpi/TicketMedioDetailModal';
import { CustoPorAlunoDetailModal } from './kpi/CustoPorAlunoDetailModal';
import { AlunosAtivosDetailModal } from './kpi/AlunosAtivosDetailModal';
import { InadimplenciaDetailModal } from './kpi/InadimplenciaDetailModal';
import { useQuery } from '@tanstack/react-query';
import { getKPIsByUnit, getHistoricalDataByUnit } from '@/utils/kpiData';
import { getCostCenterCategories } from '@/utils/costCenterData';
import { getDataByUnit } from '@/utils/unitData';

export const Dashboard = () => {
  const [selectedKPIId, setSelectedKPIId] = useState<string | null>(null);
  const [selectedChart, setSelectedChart] = useState<'revenue' | 'cost-center' | null>(null);
  const [selectedAction, setSelectedAction] = useState<'export-dre' | 'set-goals' | 'view-reports' | 'unit-analysis' | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedKPIType, setSelectedKPIType] = useState<'revenue' | 'expense' | 'cashflow' | 'margin' | 'ticket-medio' | 'custo-por-aluno' | 'alunos-ativos' | 'inadimplencia' | null>(null);
  const { selectedUnit, getUnitDisplayName } = useUnit();

  const kpiConfig = {
    primary: [
      'Receita Total',
      'Despesa Total',
      'Geração de Caixa',
      'Margem Líquida',
    ],
    secondary: [
      'Ticket Médio',
      'Custo por Aluno',
      'Alunos Ativos',
      'Inadimplência (%)',
    ],
  };

  const { data: fetchedKpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['kpis', selectedUnit],
    queryFn: () => getKPIsByUnit(selectedUnit, getUnitDisplayName),
  });

  const kpis = fetchedKpis ? {
    primary: fetchedKpis.filter(kpi => kpiConfig.primary.includes(kpi.title)),
    secondary: fetchedKpis.filter(kpi => kpiConfig.secondary.includes(kpi.title)),
  } : { primary: [], secondary: [] };
  const { data: historicalData, isLoading: historicalDataLoading } = useQuery({
    queryKey: ['historicalData', selectedUnit],
    queryFn: () => getHistoricalDataByUnit(selectedUnit),
  });
  const { data: costCenterCategories, isLoading: costCenterCategoriesLoading } = useQuery({
    queryKey: ['costCenterCategories', selectedUnit],
    queryFn: () => getCostCenterCategories(selectedUnit),
  });
  const { data: unitData, isLoading: unitDataLoading } = useQuery({
    queryKey: ['unitData', selectedUnit],
    queryFn: () => getDataByUnit(selectedUnit),
  });

  const handleKPIClick = (kpi: any) => {
    console.log('🎯 [Dashboard] KPI clicked:', kpi);
    
    // Map KPI titles to modal types
    const kpiTypeMap: Record<string, 'revenue' | 'expense' | 'cashflow' | 'margin' | 'ticket-medio' | 'custo-por-aluno' | 'alunos-ativos' | 'inadimplencia'> = {
      'Receita Total': 'revenue',
      'Despesa Total': 'expense',
      'Geração de Caixa': 'cashflow',
      'Margem Líquida': 'margin',
      'Ticket Médio': 'ticket-medio',
      'Custo por Aluno': 'custo-por-aluno',
      'Alunos Ativos': 'alunos-ativos',
      'Inadimplência (%)': 'inadimplencia'
    };
    
    const kpiType = kpiTypeMap[kpi.title];
    
    if (kpiType) {
      console.log('🎯 [Dashboard] Opening detailed modal for:', kpiType);
      setSelectedKPIType(kpiType);
    } else {
      // Fallback to original KPI modal for other KPIs
      console.log('🎯 [Dashboard] Opening original KPI modal for:', kpi.id);
      setSelectedKPIId(kpi.id);
    }
  };

  const handleChartClick = (chartType: 'revenue' | 'cost-center') => {
    setSelectedChart(chartType);
  };

  const handleActionClick = (actionType: 'export-dre' | 'set-goals' | 'view-reports' | 'unit-analysis') => {
    setSelectedAction(actionType);
  };

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
  };

  const closeAllModals = () => {
    setSelectedKPIId(null);
    setSelectedKPIType(null);
    setSelectedChart(null);
    setSelectedAction(null);
    setSelectedReport(null);
  };

  if (kpisLoading || historicalDataLoading || costCenterCategoriesLoading || unitDataLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <DashboardHeader />

        {/* KPI Sections */}
        <KPISections onKPIClick={handleKPIClick} kpis={kpis} />

        {/* Charts Section */}
        <ChartsSection onChartClick={handleChartClick} historicalData={historicalData} costCenterCategories={costCenterCategories} />

        {/* AI Insights */}
        <AIInsights />

        {/* Quick Actions */}
        <QuickActions onActionClick={handleActionClick} />
      </div>

      {/* Original KPI Detail Modal for backward compatibility */}
      <KPIDetailModal
        isOpen={!!selectedKPIId}
        onClose={() => setSelectedKPIId(null)}
        kpiId={selectedKPIId}
        unitId={selectedUnit}
      />

      {/* Primary KPI Modals */}
      <RevenueDetailModal
        isOpen={selectedKPIType === 'revenue'}
        onClose={() => setSelectedKPIType(null)}
      />

      <ExpenseDetailModal
        isOpen={selectedKPIType === 'expense'}
        onClose={() => setSelectedKPIType(null)}
      />

      <CashFlowDetailModal
        isOpen={selectedKPIType === 'cashflow'}
        onClose={() => setSelectedKPIType(null)}
      />

      <MarginDetailModal
        isOpen={selectedKPIType === 'margin'}
        onClose={() => setSelectedKPIType(null)}
      />

      {/* Secondary KPI Modals */}
      <TicketMedioDetailModal
        isOpen={selectedKPIType === 'ticket-medio'}
        onClose={() => setSelectedKPIType(null)}
      />

      <CustoPorAlunoDetailModal
        isOpen={selectedKPIType === 'custo-por-aluno'}
        onClose={() => setSelectedKPIType(null)}
      />

      <AlunosAtivosDetailModal
        isOpen={selectedKPIType === 'alunos-ativos'}
        onClose={() => setSelectedKPIType(null)}
      />

      <InadimplenciaDetailModal
        isOpen={selectedKPIType === 'inadimplencia'}
        onClose={() => setSelectedKPIType(null)}
      />

      {/* Chart Detail Modal */}
      <ChartDetailModal
        isOpen={!!selectedChart}
        onClose={() => setSelectedChart(null)}
        chartType={selectedChart}
        onReportClick={handleReportClick}
      />

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={!!selectedAction}
        onClose={() => setSelectedAction(null)}
        actionType={selectedAction}
        onReportClick={handleReportClick}
      />

      {/* Report Detail Modal */}
      <ReportDetailModal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        report={selectedReport}
      />

      {/* Toast Notifications */}
      <Toaster />
    </>
  );
};
