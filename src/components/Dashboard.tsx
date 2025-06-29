
import { AIInsights } from './AIInsights';
import { KPIDetailModal } from './KPIDetailModal';
import { ChartDetailModal } from './ChartDetailModal';
import { QuickActionModal } from './QuickActionModal';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { StrategicKPISections } from './dashboard/StrategicKPISections';
import { StrategicCharts } from './dashboard/StrategicCharts';
import { UnitComparisonTable } from './dashboard/UnitComparisonTable';
import { QuickActions } from './dashboard/QuickActions';
import { Toaster } from '@/components/ui/toaster';
import { useState } from 'react';
import { ReportDetailModal } from './ReportDetailModal';
import { useReports, Report } from '@/hooks/useReports';

type ChartType = 'revenue' | 'cost-center' | 'revenue-churn' | 'ltv-cac' | 'efficiency-radar';

export const Dashboard = () => {
  const [selectedKPI, setSelectedKPI] = useState<any>(null);
  const [selectedChart, setSelectedChart] = useState<ChartType | null>(null);
  const [selectedAction, setSelectedAction] = useState<'export-dre' | 'set-goals' | 'view-reports' | 'unit-analysis' | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const handleKPIClick = (kpi: any) => {
    setSelectedKPI(kpi);
  };

  const handleChartClick = (chartType: string) => {
    setSelectedChart(chartType as ChartType);
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

        {/* Strategic KPI Sections */}
        <StrategicKPISections onKPIClick={handleKPIClick} />

        {/* Unit Comparison Table */}
        <UnitComparisonTable />

        {/* Strategic Charts Section */}
        <StrategicCharts onChartClick={handleChartClick} />

        {/* AI Insights */}
        <AIInsights />

        {/* Quick Actions */}
        <QuickActions onActionClick={handleActionClick} />
      </div>

      {/* KPI Detail Modal */}
      {selectedKPI && (
        <KPIDetailModal
          isOpen={!!selectedKPI}
          onClose={() => setSelectedKPI(null)}
          kpi={selectedKPI}
          onReportClick={handleReportClick}
        />
      )}

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
