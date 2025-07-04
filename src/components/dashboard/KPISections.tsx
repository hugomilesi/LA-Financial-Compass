
import { KPICard } from '@/components/KPICard';
import { DollarSign, Users, TrendingUp, Percent, Target, CreditCard, Receipt, TrendingDown } from 'lucide-react';

interface KPISectionsProps {
  onKPIClick: (kpi: any) => void;
  kpis: any;
}

const iconMap = {
  DollarSign,
  Users,
  TrendingUp,
  Percent,
  Target,
  CreditCard,
  Receipt,
  TrendingDown
};

const kpiConfig = {
  primary: [
    { title: 'Receita Total', icon: 'DollarSign' },
    { title: 'Despesa Total', icon: 'CreditCard' },
    { title: 'Geração de Caixa', icon: 'TrendingUp' },
    { title: 'Margem Líquida', icon: 'Percent' },
  ],
  secondary: [
    { title: 'Ticket Médio', icon: 'Receipt' },
    { title: 'Custo por Aluno', icon: 'DollarSign' },
    { title: 'Alunos Ativos', icon: 'Users' },
    { title: 'Inadimplência (%)', icon: 'TrendingDown' },
  ]
}

export const KPISections = ({ onKPIClick, kpis }: KPISectionsProps) => {
  if (!kpis || !kpis.primary || !kpis.secondary) {
    return null; // Or a loading spinner/skeleton
  }

  const mapKPIWithIcon = (kpi: any, type: 'primary' | 'secondary') => ({
    ...kpi,
    ...kpiConfig[type].find(c => c.title === kpi.title),
  });

  return (
    <>
      {/* Primary KPIs - Top 4 metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.primary.map((kpi: any, index: number) => (
          <KPICard 
            key={`primary-${index}`}
            {...mapKPIWithIcon(kpi, 'primary')} 
            onClick={() => onKPIClick(kpi)} 
          />
        ))}
      </div>

      {/* Secondary KPIs - Additional metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.secondary.map((kpi: any, index: number) => (
          <KPICard 
            key={`secondary-${index}`}
            {...mapKPIWithIcon(kpi, 'secondary')} 
            onClick={() => onKPIClick(kpi)} 
          />
        ))}
      </div>
    </>
  );
};
