
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
  const primaryKpisData = kpis?.primary || [];
  const secondaryKpisData = kpis?.secondary || [];

  const primaryKpisToRender = kpiConfig.primary.map(config => {
    const found = primaryKpisData.find(data => data.title === config.title);
    return {
      ...config,
      value: found?.value ?? "--",
      percentage: found?.percentage ?? "--",
    };
  });

  const secondaryKpisToRender = kpiConfig.secondary.map(config => {
    const found = secondaryKpisData.find(data => data.title === config.title);
    return {
      ...config,
      value: found?.value ?? "--",
      percentage: found?.percentage ?? "--",
    };
  });

  return (
    <>
      {/* Primary KPIs - Top 4 metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {primaryKpisToRender.map((kpi: any, index: number) => (
          <KPICard
            key={`primary-${index}`}
            {...kpi}
            onClick={() => onKPIClick(kpi)}
          />
        ))}
      </div>

      {/* Secondary KPIs - Additional metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {secondaryKpisToRender.map((kpi: any, index: number) => (
          <KPICard
            key={`secondary-${index}`}
            {...kpi}
            onClick={() => onKPIClick(kpi)}
          />
        ))}
      </div>
    </>
  );
};
