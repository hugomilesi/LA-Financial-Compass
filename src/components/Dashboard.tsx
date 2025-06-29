
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

export const Dashboard = () => {
  const [selectedKPIId, setSelectedKPIId] = useState<string | null>(null);
  const [selectedChart, setSelectedChart] = useState<'revenue' | 'cost-center' | null>(null);
  const [selectedAction, setSelectedAction] = useState<'export-dre' | 'set-goals' | 'view-reports' | 'unit-analysis' | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const { selectedUnit } = useUnit();

  const handleKPIClick = (kpi: any) => {
    setSelectedKPIId(kpi.id);
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

  return (
    <>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <DashboardHeader />

        {/* KPI Sections */}
        <KPISections onKPIClick={handleKPIClick} />

        {/* Charts Section */}
        <ChartsSection onChartClick={handleChartClick} />

        {/* AI Insights */}
        <AIInsights />

        {/* Quick Actions */}
        <QuickActions onActionClick={handleActionClick} />
      </div>

      {/* KPI Detail Modal */}
      <KPIDetailModal
        isOpen={!!selectedKPIId}
        onClose={() => setSelectedKPIId(null)}
        kpiId={selectedKPIId}
        unitId={selectedUnit}
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
