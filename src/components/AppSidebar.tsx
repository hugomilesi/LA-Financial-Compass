
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Home, TrendingUp, FileText, Target, Settings, Building, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const AppSidebar = ({ currentPage, onPageChange }: AppSidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', description: 'Visão geral' },
    { id: 'kpis', icon: TrendingUp, label: 'KPIs', description: 'Indicadores chave' },
    { id: 'reports-dre', icon: FileText, label: 'Relatórios & DRE', description: 'Demonstrativos' },
    { id: 'planning', icon: Target, label: 'Planejamento', description: 'Metas e objetivos' },
    { id: 'costs', icon: DollarSign, label: 'Centro de Custos', description: 'Categorias' },
    { id: 'units', icon: Building, label: 'Por Unidade', description: 'Desempenho' },
    { id: 'settings', icon: Settings, label: 'Configurações', description: 'Sistema' },
  ];

  return (
    <div className={cn(
      "h-screen bg-primary-800 text-white flex flex-col transition-all duration-300 ease-in-out relative",
      isExpanded ? "w-64" : "w-16"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-primary-700">
        <div className="flex items-center justify-between">
          {isExpanded && (
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-primary-100">LA Music</h1>
              <p className="text-sm text-primary-300">Sistema Financeiro</p>
            </div>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-primary-700 transition-colors"
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
                  ? "bg-primary-600 text-white shadow-lg" 
                  : "hover:bg-primary-700 text-primary-200 hover:text-white"
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
      <div className="p-4 border-t border-primary-700">
        {isExpanded && (
          <div className="text-xs text-primary-300">
            <p>Versão 2.0</p>
            <p>© 2024 LA Music</p>
          </div>
        )}
      </div>
    </div>
  );
};
