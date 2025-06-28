
import { AIInsights } from './AIInsights';
import { KPIDetailModal } from './KPIDetailModal';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { KPISections } from './dashboard/KPISections';
import { ChartsSection } from './dashboard/ChartsSection';
import { QuickActions } from './dashboard/QuickActions';
import { getPrimaryKPIs, getSecondaryKPIs } from '@/utils/dashboardData';
import { useState } from 'react';

export const Dashboard = () => {
  const [selectedKPI, setSelectedKPI] = useState<any>(null);

  const handleKPIClick = (kpi: any) => {
    setSelectedKPI(kpi);
  };

  return (
    <>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <DashboardHeader />

        {/* KPI Sections */}
        <KPISections onKPIClick={handleKPIClick} />

        {/* Charts Section */}
        <ChartsSection />

        {/* AI Insights */}
        <AIInsights />

        {/* Quick Actions */}
        <QuickActions />
      </div>

      {/* KPI Detail Modal */}
      {selectedKPI && (
        <KPIDetailModal
          isOpen={!!selectedKPI}
          onClose={() => setSelectedKPI(null)}
          kpi={selectedKPI}
        />
      )}
    </>
  );
};
