
import { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { Dashboard } from '@/components/Dashboard';
import { KPIsPage } from '@/components/KPIsPage';
import { ReportsDREPage } from '@/components/ReportsDREPage';
import { PlanningPage } from '@/components/PlanningPage';
import { ChartOfAccountsPage } from '@/components/ChartOfAccountsPage';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'kpis':
        return <KPIsPage />;
      case 'reports-dre':
        return <ReportsDREPage />;
      case 'chart-of-accounts':
        return <ChartOfAccountsPage />;
      case 'planning':
        return <PlanningPage />;
      case 'costs':
        return <div className="p-6"><h1 className="text-2xl font-bold">Centro de Custos</h1><p>Em desenvolvimento...</p></div>;
      case 'units':
        return <div className="p-6"><h1 className="text-2xl font-bold">Desempenho por Unidade</h1><p>Em desenvolvimento...</p></div>;
      case 'settings':
        return <div className="p-6"><h1 className="text-2xl font-bold">Configurações</h1><p>Em desenvolvimento...</p></div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <AppSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
    </div>
  );
};

export default Index;
