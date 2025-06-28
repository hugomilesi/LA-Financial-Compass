
import { KPICard } from '@/components/KPICard';
import { DollarSign, Users, TrendingUp, Percent, Target, CreditCard, Receipt } from 'lucide-react';
import { getPrimaryKPIs, getSecondaryKPIs } from '@/utils/dashboardData';

interface KPISectionsProps {
  onKPIClick: (kpi: any) => void;
}

const iconMap = {
  DollarSign,
  Users,
  TrendingUp,
  Percent,
  Target,
  CreditCard,
  Receipt
};

export const KPISections = ({ onKPIClick }: KPISectionsProps) => {
  const primaryKPIs = getPrimaryKPIs();
  const secondaryKPIs = getSecondaryKPIs();

  const mapKPIWithIcon = (kpi: any) => ({
    ...kpi,
    icon: iconMap[kpi.icon as keyof typeof iconMap]
  });

  return (
    <>
      {/* Primary KPIs - Top 4 metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {primaryKPIs.map((kpi, index) => (
          <KPICard key={index} {...mapKPIWithIcon(kpi)} onClick={() => onKPIClick(kpi)} />
        ))}
      </div>

      {/* Secondary KPIs - Additional metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {secondaryKPIs.map((kpi, index) => (
          <KPICard key={index} {...mapKPIWithIcon(kpi)} onClick={() => onKPIClick(kpi)} />
        ))}
      </div>
    </>
  );
};
