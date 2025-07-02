import { useState } from 'react';
import { ChevronLeft, ChevronRight, Home, TrendingUp, FileText, Target, Settings, Building, DollarSign, BookOpen, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onSignOut?: () => void;
}

export const AppSidebar = ({ currentPage, onPageChange, onSignOut }: AppSidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', description: 'Visão geral' },
    { id: 'kpis', icon: TrendingUp, label: 'KPIs', description: 'Indicadores chave' },
    { id: 'reports-dre', icon: FileText, label: 'Relatórios & DRE', description: 'Demonstrativos' },
    { id: 'chart-of-accounts', icon: BookOpen, label: 'Plano de Contas', description: 'Contas contábeis' },
    { id: 'planning', icon: Target, label: 'Planejamento', description: 'Metas e objetivos' },
    { id: 'costs', icon: DollarSign, label: 'Centro de Custos', description: 'Categorias' },
    { id: 'units', icon: Building, label: 'Por Unidade', description: 'Desempenho' },
    { id: 'settings', icon: Settings, label: 'Configurações', description: 'Sistema' },
  ];

  return (
    <div className={cn(
      "h-screen bg-primary-600 text-primary-50 flex flex-col transition-all duration-300 ease-in-out relative",
      isExpanded ? "w-64" : "w-16"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-primary-500">
        <div className="flex items-center justify-between">
          {isExpanded && (
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-white">AfinaFinanças</h1>
              <p className="text-sm text-primary-200">Sistema Financeiro Inteligente</p>
            </div>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-primary-500 transition-colors"
          >
            {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={cn(
                "w-full flex items-center p-3 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-primary-400 text-white shadow-lg" 
                  : "hover:bg-primary-500 text-primary-100 hover:text-white"
              )}
            >
              <IconComponent size={20} className="flex-shrink-0" />
              {isExpanded && (
                <div className="ml-3 text-left">
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-primary-500">
        {onSignOut && (
          <button
            onClick={onSignOut}
            className={cn(
              "w-full flex items-center p-3 rounded-lg transition-all duration-200 mb-2",
              "hover:bg-primary-500 text-primary-100 hover:text-white"
            )}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {isExpanded && (
              <span className="ml-3 text-sm font-medium">Sair</span>
            )}
          </button>
        )}
        {isExpanded && (
          <div className="text-xs text-primary-200">
            <p>Versão 2.0</p>
            <p>© 2024 AfinaFinanças</p>
          </div>
        )}
      </div>
    </div>
  );
};
