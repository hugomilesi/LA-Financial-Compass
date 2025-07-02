import { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { Dashboard } from '@/components/Dashboard';
import { KPIsPage } from '@/components/KPIsPage';
import { ReportsDREPage } from '@/components/ReportsDREPage';
import { PlanningPage } from '@/components/PlanningPage';
import { ChartOfAccountsPage } from '@/components/ChartOfAccountsPage';
import { CostCenterCategoriesPage } from '@/components/CostCenterCategoriesPage';
import { UnitPerformancePage } from '@/components/UnitPerformancePage';
import { SystemSettingsPage } from '@/components/SystemSettingsPage';
import { LandingPage } from '@/components/LandingPage';
import { AuthPage } from '@/components/auth/AuthPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [authMode, setAuthMode] = useState<'landing' | 'login' | 'signup'>('landing');
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    try {
      setLogoutError(null);
      const { error } = await signOut(() => {
        setAuthMode('landing');
        setCurrentPage('dashboard');
      });
      
      if (error) {
        setLogoutError('Erro ao fazer logout. Redirecionando...');
        toast.error('Erro ao fazer logout. Redirecionando...');
        // Force redirect to landing even on error
        setTimeout(() => {
          setAuthMode('landing');
          setCurrentPage('dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Unexpected logout error:', error);
      setLogoutError('Erro inesperado. Redirecionando...');
      toast.error('Erro inesperado. Redirecionando...');
      // Force redirect to landing even on error
      setTimeout(() => {
        setAuthMode('landing');
        setCurrentPage('dashboard');
      }, 2000);
    }
  };

  // Effect to handle user changes and force redirect when user becomes null
  useEffect(() => {
    if (!user && authMode !== 'landing') {
      setAuthMode('landing');
      setCurrentPage('dashboard');
    }
  }, [user, authMode]);

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
        return <CostCenterCategoriesPage />;
      case 'units':
        return <UnitPerformancePage />;
      case 'settings':
        return <SystemSettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  const renderAuthContent = () => {
    switch (authMode) {
      case 'login':
        return <AuthPage initialMode="login" onBack={() => setAuthMode('landing')} />;
      case 'signup':
        return <AuthPage initialMode="signup" onBack={() => setAuthMode('landing')} />;
      default:
        return (
          <LandingPage
            onLoginClick={() => setAuthMode('login')}
            onSignupClick={() => setAuthMode('signup')}
          />
        );
    }
  };

  const dashboardContent = (
    <div className="min-h-screen flex w-full bg-gray-50">
      <AppSidebar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        onSignOut={handleSignOut}
      />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
    </div>
  );

  return (
    <ProtectedRoute fallback={renderAuthContent()}>
      {dashboardContent}
    </ProtectedRoute>
  );
};

export default Index;
