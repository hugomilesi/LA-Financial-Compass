
import { AIInsights } from './AIInsights';
import { KPIDetailModal } from './KPIDetailModal';
import { ChartDetailModal } from './ChartDetailModal';
import { QuickActionModal } from './QuickActionModal';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { KPISections } from './dashboard/KPISections';
import { ChartsSection } from './dashboard/ChartsSection';
import { QuickActions } from './dashboard/QuickActions';
import { useState } from 'react';

export const Dashboard = () => {
  const [selectedKPI, setSelectedKPI] = useState<any>(null);
  const [selectedChart, setSelectedChart] = useState<'revenue' | 'cost-center' | null>(null);
  const [selectedAction, setSelectedAction] = useState<'export-dre' | 'set-goals' | 'view-reports' | 'unit-analysis' | null>(null);

  const handleKPIClick = (kpi: any) => {
    setSelectedKPI(kpi);
  };

  const handleChartClick = (chartType: 'revenue' | 'cost-center') => {
    setSelectedChart(chartType);
  };

  const handleActionClick = (actionType: 'export-dre' | 'set-goals' | 'view-reports' | 'unit-analysis') => {
    setSelectedAction(actionType);
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
      {selectedKPI && (
        <KPIDetailModal
          isOpen={!!selectedKPI}
          onClose={() => setSelectedKPI(null)}
          kpi={selectedKPI}
        />
      )}

      {/* Chart Detail Modal */}
      <ChartDetailModal
        isOpen={!!selectedChart}
        onClose={() => setSelectedChart(null)}
        chartType={selectedChart}
      />

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={!!selectedAction}
        onClose={() => setSelectedAction(null)}
        actionType={selectedAction}
      />
    </>
  );
};
